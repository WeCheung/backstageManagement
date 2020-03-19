import React, {Component} from 'react';
import {
    Card
    , Button
    , Icon
    , Modal
    , message
    , Table
    , Divider
} from "antd";
import {
    postCategory
    , getClassOne
    , modifyCategory
    , deleteCategory
    , getCategories
    , judgeAuthority
    , getUserAuthority
} from "../../../api";
import AddCategory from "./addCategory";
import './index.scss'
import MyButton from "../../../components/my_button";
import Modify from "./modify";
import {getUser} from "../../../utils/storage";

class Classification extends Component {
    state = {
        visible: false              // 添加分类弹窗
        , setVisible: false         // 设置分类弹窗
        , deleteVisible: false      // 删除分类弹窗
        , data: []                  // 渲染一级分类的数据
        , subData: []               // 渲染二级分类的数据
        , columns: [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) =>{
                    return this.subName?(
                        <span style={{userSelect: 'none'}}>{text}</span>
                    ):(
                        <MyButton
                            children={text}
                            onClick={()=>(this.handleShowDetails(record))}
                        />
                    )
                }
            },
            {
                title: 'Action',
                key: 'action',
                width: 300,
                render: (text, record) => (
                    <span>
                        {
                            // 组件接受到的children属性的内容会渲染到组件展示的内容中
                            // 相当于 <MyButton>{children的值}</MyButton>
                        }
                        <MyButton children={'Set'} onClick={()=>(this.handleModify(record))}/>
                        <Divider type="vertical" />
                        <MyButton children={'Delete'} onClick={()=>(this.handleDelete(record))}/>
                    </span>
                ),
            },
        ]            // 要展示的内容
        , loading: true             // 判定当前数据是否请求并渲染完毕
        , showSub: false            // 判定展示一级分类还是二级分类页面的标志
        , isLoading: true           // 判定当前页面是否已经渲染完成
    }

    UNSAFE_componentWillMount() {
        this.GetTableData()
    }

    componentDidMount() {
        this.handleJudgeIfHasAuthority()
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    handleJudgeIfHasAuthority = async ()=>{
        const {username} = getUser()
        const result = await getUserAuthority(username)
        const {authority} = result.data
        const hasAuthority = judgeAuthority(this.props.history.location.pathname, authority)
        if( hasAuthority ){
            this.setState({
                loading: false
                , isLoading: false
            })
        } else{
            message.error('没有权限，给爷爬！')
            this.props.history.goBack()
        }
    }

    handleShowDetails = async (record)=>{
        // console.log(record);
        this.subName = record.name
        const dataObj = await getCategories(record)
        // console.log('index', dataObj);
        let {result} = dataObj.data
        // console.log('result', result);
        // 对得到的有用数据做一下格式上的修改
        result = result.map(item=>{
            return {
                key: item._id
                , name: item.name
                , classId: item.classId
            }
        })
        this.setState({
            subData: result
            , showSub: true
        })
    }

    GetTableData = async ()=>{
        let data = await getClassOne()
        data = data.data.result
        data = data.map(item=>{
            return {
                key: item._id
                , name: item.name
                , classId: item.classId
            }
        })
        this.setState({
            data
        })
    }

    handleAdd = async ()=>{
        this.classOne = await getClassOne()
        this.setState({
            visible: true
        })
    }

    handleModify = (record)=>{
        // console.log('record', record);
        this.classId = record.classId
        this.oldName = record.name
        this.setState({
            setVisible: true
        })
        // 为了使弹窗在二次渲染之后能获取焦点
        this.timer = setTimeout(()=>{
            this.input.focus()
        }, 100)
    }

    handleDelete = (record)=>{
        // console.log(record);
        this.classId = record.classId
        this.deleteItem = record.name
        this.setState({
            deleteVisible: true
        })
    }

    handleDeleteOk = async ()=>{
        const result = await deleteCategory({
            deleteItem: this.deleteItem
            , classId: this.classId
        })
        // console.log(result);
        const {status, msg} = result.data
        if( status === 0 ){  // 删除成功
            message.info(msg)
            this.setState({
                deleteVisible: false
            })
            if( this.subName ){ // 如果删除的是二级目标
                this.handleShowDetails({
                    name: this.subName
                    , classId: '0'
                })
            } else{ // 如果删除的是一级目标
                this.GetTableData()
            }
        } else{
            message.info(msg)
            this.GetTableData()
        }
    }

    handleOk = (operationType) => {
        // 用于添加分类
        if( operationType === 'add' ){
            this.form.validateFields(async (err, values) => {
                // console.log(values);
                // 确定当前操作页面是在一级目录还是二级目录下
                this.subName ? this.classId = this.subName : this.classId = '0'
                const data = await postCategory(values)

                if( data.status === 0 ){
                    message.info('添加成功！')
                    this.form.resetFields()
                    if( this.subName ){ // 如果是在二级分类中添加的数据，不管是不是添加本分类的数据都执行一遍渲染函数
                        this.handleShowDetails({
                            name: this.subName
                            , classId: '0'
                        })
                        this.classId = null // 添加成功后重置classId的值
                    } else{ // 如果是在一级分类中添加的数据则直接渲染一遍一级分类的数据
                        this.GetTableData()
                    }
                    this.setState({
                        visible: false,
                    });
                } else{
                    message.info('分类名称重复~')
                }
            });
        }
        // 用于修改分类名称
        else if( operationType === 'modify' ){
            this.form.validateFields( async (err, values) => {
                // console.log('values', values);
                const result = await modifyCategory({
                    values
                    , oldName: this.oldName
                    , classId: this.classId
                })
                // console.log('result', result);
                const {data} = result
                // console.log(data);
                if( data.status === 0 ){    // 如果修改成功
                    message.info(data.msg)
                    if( this.subName ){    // 如果是在二级分类中修改的名称，则重新获取一遍该分类的子集数据并渲染
                        this.handleShowDetails({
                            name: this.subName
                            , classId: '0'
                        })
                    } else{ // 如果修改的是一级分类则根据新数据重新渲染一遍一级分类
                        this.GetTableData() // 更新一级数据
                    }
                    this.form.resetFields()
                    this.setState({
                        setVisible: false
                    })
                } else{
                    message.info(data.msg)
                    this.form.resetFields()
                    this.input.focus()
                    // console.log(this.input);
                }
            })
        }
    };

    handleCancel = e => {
        // 删除项没有相关的form，因此这里要判断一下
        this.form && this.form.resetFields()
        this.setState({
            visible: false
            , setVisible: false
            , deleteVisible: false
        });
    };

    handleBackToSquareOne = ()=>{
        this.subName = null // 重置二级分类名称
        this.setState({
            showSub: false
        }, ()=>{
            this.GetTableData()
        })
    }

    render() {
        const {
            data
            , columns
            , loading
            , setVisible
            , deleteVisible
            , showSub
            , subData
            // , isLoading
        } = this.state

        const extra = (
            <Button type="primary" onClick={this.handleAdd}>
                <Icon type="plus" />
                <span>添加分类</span>
            </Button>
        )

        return (
            <Card
                title={!showSub?'分类管理':(
                    <div>
                        <span
                            style={{
                                fontsize: '20px'
                                , color: 'skyblue'
                                , cursor: 'pointer'
                                , userSelect: 'none'
                            }}
                            onClick={this.handleBackToSquareOne}
                        >分类管理</span>
                        <Icon
                            type="arrow-right"
                            style={{marginLeft: '10px'}}
                        />
                        <span
                            style={{userSelect: 'none', marginLeft: '10px'}}
                        >{this.subName && this.subName}</span>
                    </div>
                )}
                extra={extra}
            >

                <Table
                    columns={columns}
                    dataSource={!showSub?data:subData}
                    pagination={{defaultPageSize: 4}}
                    loading={loading}
                />

                <Modal
                    title="添加分类"
                    visible={this.state.visible}
                    onOk={()=>(this.handleOk('add'))}
                    onCancel={this.handleCancel}
                    okText={'确定'}
                    cancelText={'取消'}
                >
                    {/*给 AddCategory 这个组件传一个用来获取其组件表单资料的函数*/}
                    <AddCategory
                        getForm={form => this.form = form}
                        dataToRender={this.classOne}
                    />
                </Modal>

                <Modal
                    title={'修改分类名称'}
                    visible={setVisible}
                    onOk={()=>{this.handleOk('modify')}}
                    onCancel={this.handleCancel}
                    okText={'确认修改'}
                    cancelText={'取消'}
                >
                    <Modify
                        getForm={form => this.form = form}
                        getInput={theInput => this.input = theInput.current.input}
                    />
                </Modal>

                <Modal
                    title={'删除分类'}
                    visible={deleteVisible}
                    onOk={this.handleDeleteOk}
                    onCancel={this.handleCancel}
                    okText={'确认删除'}
                    cancelText={'取消'}
                >
                    <p>您确定要删除该分类吗？</p>
                </Modal>
            </Card>
        );
    }
}

export default Classification;