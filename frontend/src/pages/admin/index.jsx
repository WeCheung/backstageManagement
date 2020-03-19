import React, {PureComponent} from 'react';
import {message, Layout, Menu, Icon} from "antd";
import {
    NavLink
    , Redirect
    , Route
    , Switch
} from "react-router-dom";
import {getUser} from "../../utils/storage";
import menu from '../../config/sider'
import './index.scss'
import MyHeader from "../../components/my_header";
import {getUserAuthority} from "../../api";

const { Content, Footer, Sider } = Layout
const { SubMenu } = Menu

class Admin extends PureComponent {
    state = {
        selectedKey: []
        , openKeys: []
        , authority: []
        , admin: false
    }

    UNSAFE_componentWillMount() {
        const ifLogin = getUser()
        if( !ifLogin.username ){
            message.error('不登录就想进来？给老子爬！')
            this.props.history.push('/login')
        }
        // 设置要展开的组
        this.handleFindOpenSubMenu(menu)
        // 设置初始高亮的选项
        this.handleGetSelectedKey(menu)
    }

    componentDidMount() {
        this.handleGetAuthority()
    }

    handleGetSelectedKey = (arr)=>{
        const url = this.props.location.pathname
        if( url === '/admin' ){ // 用于应付从登录页面到登录后页面的首页项选中
            this.setState({
                selectedKey: ['/admin/index']
            })
        } else{
            arr.some((item)=>{
                if( item.children ){
                    this.handleGetSelectedKey(item.children)
                    return false
                } else{
                    const flag = new RegExp(item.route).test(url)
                    if( item.route === url || flag ){
                        this.setState({
                            selectedKey: [item.route]
                        })
                        return true
                    }
                }
                return false // 单纯用来消除页面控制台警告的返回值
            })
        }

    }

    handleFindOpenSubMenu = (menu)=>{
        if( !menu.length ) return
        const {pathname} = this.props.location
        menu.some((item)=>{
            if( item.children ){    // 只找有子项的
                const result = item.children.some(cItem=>{
                    const flag = new RegExp(cItem.route).test(pathname)
                    if( cItem.route === pathname || flag ){
                        this.setState({
                            openKeys: [item.key]
                        })
                        return true
                    }
                    return false    // 用于消除页面控制台警告
                })
                return result
            }
            return false
        })

    }

    handleRenderMenu = (menu)=>{
        if( !menu.length ) return
        return menu.map((item)=>{
            if( item.children ){    // 有子项
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.handleRenderMenu(item.children)}
                    </SubMenu>
                )
            } else { // 没有子项
                const hasAuthority = this.handleJudgeAuthority(item)
                return (
                    <Menu.Item key={item.route} disabled={!hasAuthority}>
                        <NavLink to={item.route}>
                            <Icon type={item.icon} />
                            <span className="nav-text">{item.title}</span>
                        </NavLink>
                    </Menu.Item>
                )
            }
        })
    }

    handleRenderRoute = (route)=>{
        if( !route.length ) return
        return route.map((item, index)=>{
            if( item.children ){
                return this.handleRenderRoute(item.children)
            } else{
                return <Route path={item.route} component={item.component} key={index}/>
            }
        })
    }

    handleGetAuthority = async ()=>{
        const {username} = getUser()
        const result = await getUserAuthority(username)
        const {data:{status, msg, authority}} = result

        if( status === 0 ){
            this.setState({ authority })
        } else if( status === 3 ){
            this.setState({ admin: true })
            message.success(msg)
        } else{
            message.error(msg)
        }
    }

    handleJudgeAuthority = (item)=>{
        const {authority} = this.state
        const {username} = getUser()
        if( authority.length ){
            return authority.includes(item.route)
        } else if(authority.length === 0 && username === 'admin'){
            return true
        }
        return false
    }

    render() {
        const {selectedKey, openKeys} = this.state
        return (
            <Layout>
                {/*侧菜单栏*/}
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                >
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={selectedKey}
                        defaultOpenKeys={openKeys}
                    >
                        {
                            this.handleRenderMenu(menu)
                        }
                    </Menu>
                </Sider>

                {/*右侧内容区*/}
                <Layout>
                    {/*头部*/}
                    <MyHeader />

                    {/*内容*/}
                    <Content style={{margin: '0 16px', height: 'auto', overflowY: 'scroll'}}>
                        <div style={{ padding: 24, background: '#fff', minHeight: '100%' }}>
                            <Switch>
                                {
                                    this.handleRenderRoute(menu)
                                }
                                <Redirect to={'/admin/index'}/>
                            </Switch>
                        </div>
                    </Content>

                    {/*底部*/}
                    <Footer style={
                        {
                            textAlign: 'center'
                            , background: 'rgb(242,241,248)'
                        }
                    }>欢迎来到 react + node 后台管理系统</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;