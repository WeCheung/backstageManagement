import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {
    Cascader
    , Icon
    , Card
    , Form
    , Button
    , message
    , Input
} from "antd";
import MyButton from "../../../components/my_button";
import {getClassOne, getCategories, goodsInfo, updateInfo, getUserAuthority, judgeAuthority} from "../../../api";
import PicturesWall from "./pictures_wall";
import EditorConvertToHTML from "./editor";
import {getUser} from "../../../utils/storage";

const { TextArea } = Input

class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
            , classification: []
            , imgs: []
            , name: ''
            , description: ''
            , price: 0
            , details: ''
            , page: 1
            , loading: true
        }
        this.img = React.createRef()
        this.editor = React.createRef()
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
            this.loadClassOne()
        } else{
            message.error('没有权限，给爷爬！')
            this.props.history.goBack()
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    backToManage = () => {
        this.props.history.push({
            pathname: '/admin/manage'
            , state: {
                page: this.state.page
            }
        })
    }

    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // console.log(targetOption);
        // load options lazily
        setTimeout(async () => {
            targetOption.loading = false;
            // console.log(targetOption.value);
            let optionsChildren = await getCategories({name: targetOption.value})
            if( optionsChildren.data.result.length ){   // 有值的情况下才渲染
                optionsChildren = optionsChildren.data.result.map(item=>{
                    return {
                        label: item.name
                        , value: item.name
                    }
                })
                targetOption.children = optionsChildren
            } else{
                targetOption.isLeaf = true
                // targetOption.children = null
            }

            this.setState({
                options: [...this.state.options],
            });
        }, 1000);
    };

    loadClassOne = async ()=>{
        let result = await getClassOne()
        result = result.data.result
        let options = result.map(item=>{
            return {
                value: item.name
                , label: item.name
                , isLeaf: false
            }
        })
        // 对options处理一下，如果当前是修改商品页面同时修改的商品属于二级分类则渲染其二级分类到state中
        const renderObj = await this.handleJudge(options)
        this.setState({
            ...renderObj
            , loading: false
        })
    }

    // 判断当前是添加商品还是修改商品
    handleJudge = async (options)=>{
        if( this.props.location.state ){    // 修改商品页面
            // 获取原有的信息，同时设置好相应的flag
            // console.log(this.props.location.state.info);
            const {classification, name, imgs, description, price, details, _id} = this.props.location.state.info
            this._id = _id
            this.updateInfo = true

            // 如果该商品属于二级分类，则要把其子项也渲染到组件的state中
            if( classification.length === 2 ){
                const targetOption = classification[0]
                let optionsChildren = await getCategories({name: targetOption})
                const optionIndex = options.findIndex(item=>item.value === targetOption)
                // 处理一下要渲染的子项，使其拥有用于渲染的属性
                optionsChildren = optionsChildren.data.result.map(item=>{
                    item.value = item.name
                    item.label = item.name
                    return item
                })
                options[optionIndex].children = optionsChildren
            }
            return {options, name, imgs, description, price, details, classification}
        } else {                            // 添加商品页面
            this.updateInfo = false
            return {options}
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // console.log(this.editor.current.getEditorContent());    // 富文本编辑器内容
                // console.log(this.img.current.getImagesInfo())           // 所选图片内容
                const {name, description, price, classification} = values
                const details = this.editor.current.getEditorContent()
                const imgs = this.img.current.getImagesInfo()
                const info = {name, description, price, classification, details, imgs, _id: this._id}

                if( this.updateInfo ){  // 更新商品
                    const result = await updateInfo(info)
                    // console.log(result.data);
                    const {status, msg} = result.data
                    if( status === 0 ){ // 修改成功
                        message.success(msg)
                        this.timer = setTimeout(()=>{
                            this.props.history.push('/admin/manage')
                        }, 1000)
                    } else{
                        message.error(msg)
                    }
                } else{                 // 添加商品
                    const result = await goodsInfo(info)
                    // console.log(result.data);
                    const {status, msg} = result.data
                    if( status === 0 ){ // 添加成功
                        message.success(msg)
                        this.timer = setTimeout(()=>{
                            this.props.history.push('/admin/manage')
                        }, 1000)
                    } else{
                        message.error(msg)
                    }
                }
            }
        });
    };

    render() {
        const title = (
            <div className="title">
                <MyButton className={'backButton'} onClick={this.backToManage}>
                    <Icon type="arrow-left" style={{fontSize: '20px', color: 'rgb(24, 144, 255)'}}/>
                </MyButton>
                <span style={{marginLeft: '5px', userSelect: 'none'}}>
                    {this.props.location.state ? '修改商品页面' : '添加商品页面'}
                </span>
            </div>
        )

        const formItemLayout = {
            labelCol: {
                sm: { span: 8 },
            },
            wrapperCol: {
                sm: { span: 12 },
            },
        }

        const buttonLayout = {
            wrapperCol: {
                sm: { span: 12, offset: 8 },
            },
        }

        const {getFieldDecorator} = this.props.form

        const {classification, imgs, name, description, price, details, loading, options} = this.state
        // console.log(options);

        return (
            <Card title={title} loading={loading}>
                <Form {...formItemLayout}>
                    <Form.Item label={'商品名称'}>
                        {
                            getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入商品名称'}]
                                , initialValue: name
                            })(
                                <Input placeholder={'请输入商品名称'}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'商品简述'}>
                        {
                            getFieldDecorator('description', {
                                rules: [{required: true, message: '请输入商品简述'}]
                                , initialValue: description
                            })(
                                <TextArea placeholder="请输入商品简述" autoSize />
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'商品价格'}>
                        {
                            getFieldDecorator('price', {
                                rules: [{required: true, message: '请输入商品价格'}]
                                , initialValue: price
                            })(
                                <Input type={'number'} addonAfter={'元'}/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'商品分类'}>
                        {
                            getFieldDecorator('classification', {
                                rules: [{required: true, message: '请选择商品分类'}]
                                , initialValue: classification
                            })(
                                <Cascader
                                    options={options}
                                    loadData={this.loadData}
                                    changeOnSelect
                                    placeholder={'请选择商品分类'}
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'商品图片'}>
                        <PicturesWall ref={this.img} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label={'商品详细描述'}>
                        <EditorConvertToHTML ref={this.editor} details={details}/>
                    </Form.Item>
                    <Form.Item {...buttonLayout}>
                        <Button
                            type={'primary'}
                            onClick={this.handleSubmit}
                            children={'确定'}
                            style={{margin: 'auto'}}
                        />
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

AddItem = withRouter(AddItem)
export default Form.create()(AddItem);