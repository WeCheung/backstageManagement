import React, {Component} from 'react';
import {
    Form
    , Input
} from "antd";

class AddCharacter extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator('roleName', {
                        rules: [{ required: true, message: '角色名不能为空' }],
                    })(
                        <Input placeholder="请输入添加角色名"/>,
                    )}
                </Form.Item>
            </Form>
        );
    }
}
AddCharacter = Form.create()(AddCharacter)

export default AddCharacter;