import React, {Component, Fragment} from 'react';
import {
    Form
    , Select
    , Input
    , Button
    , Icon
    , Table
    , Divider
    , message
} from "antd";
import {indexInfo, getUserAuthority, judgeAuthority, deleteGoods} from "../../../api";
import {PAGE_SIZE} from "../../../utils/constants";
import MyButton from "../../../components/my_button";
import {connect} from 'react-redux'
import {changePage} from "../../../actions/changePage";
import {getUser} from "../../../utils/storage";

const {Option} = Select

class ItemManager extends Component {
    state = {
        columns: [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                render: text => <span className={'cannotSelect'}>{text}</span>,
            },
            {
                title: '商品描述',
                dataIndex: 'description',
                key: 'description',
                render: text => (
                    <span className={'cannotSelect'}>{text}</span>
                )
            },
            {
                title: '商品价格',
                dataIndex: 'price',
                key: 'price',
                render: text => (
                    <span className={'cannotSelect'}>{`￥${text}元`}</span>
                )
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    // console.log(text);
                    return (
                        <span>
                            <MyButton
                                style={{color: 'rgb(130, 210, 255)'}}
                                onClick={()=>this.props.history.push({
                                    pathname: '/admin/manage/details'
                                    , state: {
                                        info: text
                                        , page: this.state.page
                                    }
                                })}
                            >详情</MyButton>
                            <Divider type="vertical" />
                            <MyButton
                                style={{color: 'rgb(130, 210, 255)'}}
                                onClick={()=>this.props.history.push({
                                    pathname: '/admin/manage/addItem'
                                    , state: {
                                        info: text
                                        , page: this.state.page
                                    }
                                })}
                            >修改</MyButton>
                            <Divider type="vertical" />
                            <MyButton
                                style={{color: 'rgb(130, 210, 255)'}}
                                onClick={()=>{this.handleDelete(record)}}
                            >删除</MyButton>
                        </span>
                    )

               } ,
            },
        ]
        , dataArr: []
        , total: 0
        , keywords: ''
        , method: 'searchByName'
        , loading: true
    }

    UNSAFE_componentWillMount() {
        // console.log('manager组件首页', this.props);
        // if( this.props.location.state.page ) {   // 如果是从修改商品页面返回的
        //     console.log('从商品页返回了！');
        //     this.setState({
        //         page: this.props.location.state.page
        //     })
        // }
    }

    componentDidMount() {
        this.handleJudgeIfHasAuthority()
    }

    handleJudgeIfHasAuthority = async ()=>{
        const {username} = getUser()
        const result = await getUserAuthority(username)
        const {authority} = result.data
        const hasAuthority = judgeAuthority(this.props.history.location.pathname, authority)
        if( hasAuthority ){
            this.handleRenderItems(this.props.state.Page.currentPage, PAGE_SIZE)
        } else{
            message.error('没有权限，给爷爬！')
            this.props.history.goBack()
        }
    }

    handleChangeMethod = (value)=>{
        // console.log(`selected ${value}`);
        this.setState({
            method: value
        })
    }

    handleChangeKeywords = e => {
        this.setState({
            keywords: e.target.value
        })
    }

    handleAddItem = ()=>{
        this.props.history.push('/admin/manage/addItem')
    }

    handleRenderItems = async (page, num, method, keyword)=>{
        const result = await indexInfo({
            page
            , num
            , [method]: keyword
        })
        // console.log('result', result);
        const {data, status} = result
        const {dataArr, total} = data
        if( status === 200 ){
            this.setState({
                dataArr
                , total
                , loading: false
            })
        }

    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                const {searchMethod, keyword} = values
                this.handleRenderItems(1, PAGE_SIZE, searchMethod, keyword)
            }
        });
    };

    handleDelete = async (info)=>{
        const result = await deleteGoods(info)
        const {data:{status, msg}} = result
        if( status === 0 ){
            message.success(msg)
            this.handleRenderItems(this.props.state.Page.currentPage, PAGE_SIZE)
        } else{
            message.error(msg)
        }
    }

    render() {
        const {currentPage} = this.props.state.Page
        // console.log('我是currentPage', currentPage, typeof currentPage);
        const {getFieldDecorator} = this.props.form
        const {columns, dataArr, total, method, keywords, loading} = this.state
        return (
            <Fragment>
                {/*表单区*/}
                <div className="formField clearfix">
                    <Form layout={'inline'} style={{float: 'left'}}>
                        <Form.Item>
                            {
                                getFieldDecorator('searchMethod', {
                                    initialValue: 'searchByName'
                                    , rules:[

                                    ]
                                    , setFieldsValue: method
                                })(
                                    <Select
                                        style={{ width: 200 }}
                                        onChange={this.handleChangeMethod}
                                    >
                                        <Option title={"searchByName"} value="searchByName">按名称搜索</Option>
                                        <Option title={"searchByDescription"} value="searchByDescription">按描述搜索</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('keyword', {
                                    rules: []
                                    , setFieldsValue: keywords
                                })(
                                    <Input
                                        placeholder={'搜索关键字'}
                                        onChange={this.handleChangeKeywords}
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type={'primary'} children={'搜索'} onClick={this.handleSubmit}/>
                        </Form.Item>
                    </Form>
                    <Button type={'primary'} style={{float: 'right'}} onClick={this.handleAddItem}>
                        <Icon type={'plus'} />
                        <span>添加商品</span>
                    </Button>
                </div>

                {/*内容展示区*/}
                <div className="managerContent">
                    <Table
                        columns={columns}
                        dataSource={dataArr}
                        rowKey={'_id'}
                        bordered
                        pagination={{
                            total
                            , defaultPageSize: PAGE_SIZE
                            , current: currentPage
                            , onChange: page => {
                                // console.log(page, typeof page);
                                this.props.changePage(page)
                                this.handleRenderItems(page, PAGE_SIZE, method, keywords)
                            }
                        }}
                        loading={loading}
                    />
                </div>
            </Fragment>
        );
    }
}

// 将 state 映射到 props 中，这样组件就可以通过 this.props 获得仓库中新的状态
const mapStateToProps = state => {
    return { state }    // 相当于 store.getState()
}
// 将指令传到组件的 this.props 中
const mapDispatchToProps = {
    changePage
}
ItemManager = connect(mapStateToProps, mapDispatchToProps)(ItemManager)

export default Form.create()(ItemManager);