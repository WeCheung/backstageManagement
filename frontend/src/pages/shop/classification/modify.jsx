import React, {PureComponent} from 'react';
import {Form, Input} from "antd";

class Modify extends PureComponent {
    constructor(args){
        super(args)
        this.state = {}
        this.input = React.createRef()
    }

    UNSAFE_componentWillMount() {
        //  将本表单的数据传到父组件中
        this.props.getForm(this.props.form)
    }

    componentDidMount() {
        this.props.getInput(this.input)
        this.input.current.input.focus()
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName', {
                            rules: [
                                {
                                    required: true
                                    , message: '分类名称不能为空'
                                }
                                , {
                                    min: 1
                                    , message: '名称长度不能少于1位'
                                }
                                , {
                                    max: 8
                                    , message: '名称长度不能多于8位'
                                }
                            ]
                        })(
                            <Input
                                placeholder={'请输入修改后的名称'}
                                ref={this.input}
                            />
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(Modify)