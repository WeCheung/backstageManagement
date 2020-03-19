import React, {Component} from 'react';
import {
    Form
    , Tree
    , Input
} from "antd";
import menuConfig from '../../config/sider'

const { TreeNode } = Tree;

class SetAuthority extends Component {
    state = {
        menu: []
        , authority: []
    }

    UNSAFE_componentWillMount() {
        // console.log(this.props.role.authority);
        const {authority} = this.props.role
        const menu = this.handleRenderTreeData(menuConfig)
        this.setState({ menu, authority })
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        // console.log(nextProps);
        const {authority} = nextProps.role
        this.setState({ authority })
    }

    onCheck = (checkedKeys, info) => {
        // console.log('onCheck', checkedKeys, info);
        this.setState({
            authority: checkedKeys
        })
    };

    handleRenderTreeData = (dataSource)=>{
        return dataSource.reduce((pre, next)=>{
            if( next.children ){    // 有子项
                pre.push(
                    <TreeNode title={next.title} key={next.key} >
                        {
                            this.handleRenderTreeData(next.children)
                        }
                    </TreeNode>
                )
            } else{                 // 只有自己本项
                pre.push(<TreeNode title={next.title} key={next.route} />)
            }
            return pre
        }, [])
    }

    render() {
        const {menu, authority} = this.state
        return (
            <Form>
                <Form.Item>
                    <Input disabled value={this.props.role.name}/>
                </Form.Item>
                <Form.Item>
                    <Tree
                        checkable
                        selectable={false}       // 写了这行代码后点击文字也能选中复选框了
                        defaultExpandAll={true}
                        checkedKeys={authority}
                        onCheck={this.onCheck}
                    >
                        { menu }
                    </Tree>
                </Form.Item>
            </Form>
        );
    }
}
// SetAuthority = Form.create()(SetAuthority)
// 写了上面这行代码之后在父组件中就获取不到该组件应有的 state

export default SetAuthority;