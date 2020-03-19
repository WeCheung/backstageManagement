import React, {Component} from 'react';
import {
    Card
    , Modal
    , Button
    , Table
    , message
} from "antd";

import './index.scss'
import AddCharacter from "./add_character";
import {addRoles, getRoles, setRoleAuthority, getSingleUser, getUserAuthority, judgeAuthority} from "../../api";
import {getUser, removeUser} from "../../utils/storage";
import SetAuthority from "./set_authority";


class Character extends Component {
    constructor(props){
        super(props)
        this.setAuthority = React.createRef()
    }

    state = {
        visible: false              // 添加角色弹窗是否可见
        , data: []                  // 角色渲染数据源
        , loading: true             // 列表加载状态
        , selectedRowKeys: []       // 当前列表选中行
        , role: {}                  // 当前列表选中行信息
        , authority: false          // 设置角色权限弹窗是否可见
    };

    componentDidMount() {
        this.handleJudgeIfHasAuthority()
    }

    handleJudgeIfHasAuthority = async ()=>{
        const {username} = getUser()
        const result = await getUserAuthority(username)
        const {authority} = result.data
        const hasAuthority = judgeAuthority(this.props.history.location.pathname, authority)
        if( hasAuthority ){
            this.handleGetRoles()
            this.setState({
                loading: false
            })
        } else{
            message.error('没有权限，给爷爬！')
            this.props.history.goBack()
        }
    }

    // 获取所有角色的信息
    handleGetRoles = async () => {
        const result = await getRoles()
        const {status, allRoles, msg} = result.data

        if( status === 0 ){
            this.setState({ data: allRoles })
        } else{
            message.error(msg)
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.form.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {roleName} = values
                const result = await addRoles({roleName, create_time: new Date().toLocaleString()})
                const {status, msg} = result.data
                if( status === 0 ){
                    message.success(msg)
                    this.form.props.form.resetFields()
                    this.setState({
                        visible: false,
                    });
                    this.handleGetRoles()
                } else{
                    message.error(msg)
                }
            }
        })
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            authority: false
        });
    };

    showAuthority = ()=>{
        this.setState({ authority: true })
    }

    handleAuthorityOk = async e =>{
        const {role} = this.state
        const {authority} = this.setAuthority.current.state
        const {username} = getUser()
        const auth_time = new Date().toLocaleString()
        const roleName = role.name

        // 给当前角色信息补充上授权内容、授权人、授权时间
        role.authority = authority
        role.auth_name = username
        role.auth_time = auth_time

        // 向后台发送数据并且获取当前登录用户角色
        const dataArr = await Promise.all([setRoleAuthority(role), getSingleUser(username)])
        const userRole = dataArr[1]['data']['user']['role']
        // console.log(dataArr);

        const {status, msg} = dataArr[0]['data']
        if( status === 0 ){
            if( userRole === roleName ){
                message.success('修改权限成功！')
                removeUser()
                this.props.history.push('/login')
            } else{
                message.success(msg)
                this.setState({ authority: false })
            }
        } else{
            message.error(msg)
        }

    }

    columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'create_time',
            dataIndex: 'create_time',
        },
        {
            title: 'auth_time',
            dataIndex: 'auth_time',
        },
        {
            title: 'auth_name',
            dataIndex: 'auth_name',
        },
    ];

    render() {
        const {data, loading, role} = this.state

        const title = (
            <span>
                <Button type={'primary'} icon={'plus'} onClick={this.showModal}>添加角色</Button>
                <Button
                    type={'primary'}
                    style={{marginLeft: 10}}
                    disabled={!this.state.role._id}
                    onClick={this.showAuthority}
                >设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                {/*添加角色弹窗*/}
                <Modal
                    title="请添加角色"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={'确定'}
                    cancelText={'取消'}
                >
                    <AddCharacter wrappedComponentRef={(form) => this.form = form}/>
                </Modal>
                {/*角色渲染列表*/}
                <Table
                    rowSelection={{
                        type: 'radio'
                        , selectedRowKeys: this.state.selectedRowKeys
                        , onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({ selectedRowKeys, role: selectedRows[0] })
                        }
                    }}
                    pagination={{defaultPageSize: 4}}
                    loading={loading}
                    columns={this.columns}
                    dataSource={data}
                    rowKey={'_id'}
                    onRow={(record, index)=>{
                        return {
                            onClick: event => {
                                this.setState({ selectedRowKeys: [record._id], role: record })
                            }, // 点击行
                        };
                    }}
                />
                {/*设置角色权限弹窗*/}
                <Modal
                    title={'角色设置弹窗'}
                    visible={this.state.authority}
                    onOk={this.handleAuthorityOk}
                    onCancel={this.handleCancel}
                    okText={'确定'}
                    cancelText={'取消'}
                    // ref={this.setAuthority}
                >
                    <SetAuthority
                        role={role}
                        ref={this.setAuthority}
                    />
                </Modal>
            </Card>
        );
    }
}

export default Character;