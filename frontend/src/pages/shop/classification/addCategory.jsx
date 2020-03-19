import React, {PureComponent} from 'react';
import {
    Form
    , Select
    , Input
} from "antd";

const { Option } = Select

class AddCategory extends PureComponent {
    state = {
        levelOne: []
    }

    UNSAFE_componentWillMount() {
        // 将本组件的表单数据传到父组件中
        this.props.getForm(this.props.form)
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.setState({
            levelOne: this.props.dataToRender.data.result
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        // const {levelOne} = this.state
        const levelOne = this.props.dataToRender.data.result
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator('category', {
                        initialValue: '0'
                    })(
                        <Select>
                            <Option value="0">一级分类</Option>
                            {/*在这里要渲染数据库中已有的一级分类数据*/}
                            {
                                levelOne.length > 0 && levelOne.map((item, index)=>{
                                    return (
                                        <Option key={index} value={item.name}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName', {
                            rules: [
                                {
                                    required: true
                                    , message: '分类名称不能为空'
                                }
                            ]
                        })(
                            <Input placeholder={'请输入分类名称'}/>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(AddCategory)