import React, {Component} from 'react';
import {
    Form
    , Input
    , Icon
    , Select
} from "antd";
import {getRoles} from "../../api";

const { Option } = Select;

class AddInfo extends Component {
    state = {
        roles: []
        , userInfo: {}
    }

    componentDidMount() {
        this.handleGetRoles()
    }

    handleGetRoles = async ()=>{
        const result = await getRoles()
        this.setState({
            roles: result.data.allRoles
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const {roles} = this.state

        const {userInfo} = this.props

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        return (
            <Form {...formItemLayout}>
                <Form.Item label={'用户名'}>
                    {getFieldDecorator('username', {
                        rules: [
                            { required: true, message: '请输入用户名' }
                            , { min: 6, message:'用户名最小长度为6位' }
                            , { max: 16, message:'用户名最大长度为16位' }
                        ],
                        initialValue: userInfo.username
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名"
                        />,
                    )}
                </Form.Item>
                <Form.Item label={'密码'}>
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '请输入密码' }
                            , { min: 8, message: '密码最少长度为8位' }
                            , { max: 16, message: '密码最大长度为16位' }
                        ],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="密码"
                            type={'password'}
                        />,
                    )}
                </Form.Item>
                <Form.Item label={'手机号'}>
                    {getFieldDecorator('phone', {
                        rules: [
                            { required: true, message: '请输入手机号' }
                            // , { len: 11, message: '手机号长度为11位' }
                        ],
                        initialValue: userInfo.phone
                    })(
                        <Input
                            prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="手机号"
                        />,
                    )}
                </Form.Item>
                <Form.Item label={'角色'}>
                    {getFieldDecorator('role', {
                        rules: [{ required: true, message: '请选择角色' }],
                        initialValue: userInfo.role
                    })(
                        <Select placeholder={'请选择角色'}>
                            {
                                roles.length && roles.reduce((pre, next)=>{
                                    pre.push(<Option key={next.name}>{next.name}</Option>)
                                    return pre
                                }, [])
                            }
                        </Select>
                    )}
                </Form.Item>
            </Form>
        );
    }
}

AddInfo = Form.create()(AddInfo)
export default AddInfo;