import React, {Component} from 'react';
import axios from 'axios'
import { Form, Icon, Input, Button, message } from 'antd'
import {saveUser} from '../../utils/storage'
import './index.scss'

class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            axios.post("/login", values)
                .then(res=>{
                    // console.log(res);
                    const {status, msg} = res.data
                    if( status === 0 ){ // 验证成功
                        message.success(msg)
                        saveUser(values)
                        this.timer = setTimeout(()=>{
                            this.props.history.push('/admin')
                        }, 1000)
                    } else{
                        message.error(msg)
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
        });
    };

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className={'login'}>
                <h2>React 后台管理系统</h2>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    {/*账号*/}
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true
                                    , message: '用户名不能为空'
                                }
                                ,{
                                    min: 5
                                    , message: '用户名长度不能少于5位'
                                }
                                ,{
                                    max: 16
                                    , message: '用户名长度不能多于16位'
                                }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />,
                        )}
                    </Form.Item>
                    {/*密码*/}
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true
                                    , message: '密码不能为空'
                                }
                                ,{
                                    min: 6
                                    , message: '密码长度不能少于6位'
                                }
                                ,{
                                    max: 12
                                    , message: '密码长度不能多于12位'
                                }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />,
                        )}
                    </Form.Item>
                    {/*登录按钮*/}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="login-form-button"
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Login);