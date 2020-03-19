import React, {Component} from 'react';
import {
    Card
    , Table
    , Button
    , Modal
    , message
    , Divider
} from "antd";
import './index.scss'
import {addUser, getUsers, updateUser, deleteUser, getUserAuthority, judgeAuthority} from "../../api";
import {getUser} from "../../utils/storage";
import {PAGE_SIZE} from "../../utils/constants";
import AddInfo from "./addInfo";
import MyButton from "../../components/my_button";

const { confirm } = Modal;

class User extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false
            , users: []
            , selectedUser : {}
            , loading: true
        }
        this.modify = false
    }

    columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            // render: text => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: text => {
                return (<span>{new Date(text).toLocaleString()}</span>)
            }
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '所属角色',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                // console.log(record);
                return (
                    <span>
                        <MyButton
                            style={{color:'rgb(24,144,255)'}}
                            onClick={()=>{this.handleModify(record)}}
                        >修改</MyButton>
                        <Divider type="vertical" />
                        <MyButton
                            style={{color:'rgb(24,144,255)'}}
                            onClick={()=>{this.showDeleteConfirm(record)}}
                        >删除</MyButton>
                    </span>
                )},
        },
    ];

    componentDidMount() {
        this.handleJudgeIfHasAuthority()
    }

    handleJudgeIfHasAuthority = async ()=>{
        const {username} = getUser()
        const result = await getUserAuthority(username)
        const {authority} = result.data
        const hasAuthority = judgeAuthority(this.props.history.location.pathname, authority)
        if( hasAuthority ){
            this.getUsers()
        } else{
            message.error('没有权限，给爷爬！')
            this.props.history.goBack()
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        // console.log(this.form);
        this.form.props.form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                let result = null
                const {_id} = this.state.selectedUser
                values._id = _id
                if( this.modify ){  // 修改用户信息
                    result = await updateUser(values)
                } else{             // 添加用户信息
                    result = await addUser(values)
                }
                const {status, msg} = result.data
                if( status === 0 ){
                    message.success(msg)
                    this.form.props.form.resetFields()
                    this.getUsers()
                    this.setState({
                        visible: false,
                        selectedUser: {}
                    });
                    this.modify = false
                } else{
                    message.error(msg)
                }
            }
        });
    };

    handleCancel = () => {
        this.form.props.form.resetFields()
        this.modify = false
        this.setState({
            visible: false,
            selectedUser: {}
        });
    };

    getUsers = async ()=>{
        const data = await getUsers()
        // console.log(data);
        const {users} = data.data
        // console.log(users);
        this.setState({ users, loading: false })
    }

    handleModify = (selectedUser)=>{
        this.modify = true
        this.setState({ visible: true, selectedUser })
    }

    showDeleteConfirm = (user)=>{
        confirm({
            title: `你确定要删除${user.username}吗`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async ()=> {
                const result = await deleteUser(user)
                const {status, msg} = result.data
                if( status === 0 ){
                    message.success(msg)
                    this.getUsers()
                } else{
                    message.error(msg)
                }
            },
            onCancel: ()=> {
                this.getUsers()
            },
        });
    }

    render() {
        const title = (
            <span>
                <Button type={'primary'} icon="plus" children={'添加用户'}  onClick={this.showModal}/>
            </span>
        )

        const {users, selectedUser, loading} = this.state

        return (
            <Card title={title}>
                <Modal
                    title={this.modify?"修改用户":"添加用户"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={'确定'}
                    cancelText={'取消'}
                >
                    <AddInfo
                        wrappedComponentRef={(form) => this.form = form}
                        userInfo={selectedUser}
                    />
                </Modal>
                <Table
                    columns={this.columns}
                    dataSource={users}
                    pagination={{
                        defaultPageSize: PAGE_SIZE
                    }}
                    rowKey={'_id'}
                    loading={loading}
                />
            </Card>
        );
    }
}

export default User;