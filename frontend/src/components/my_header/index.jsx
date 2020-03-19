import React, {PureComponent} from 'react';
import {
    withRouter
} from 'react-router-dom'
import {Modal} from "antd";
import {removeUser, getUser} from "../../utils/storage";
// import {getWeather} from "../../api";
import menu from '../../config/sider'
import './index.scss'

const { confirm } = Modal

class MyHeader extends PureComponent {
    state = {
        currentTime: new Date().toLocaleString()
        , dayPictureUrl: ''
        , weather: ''
        , temperature: ''
        , wind: ''
        , title: ''
        , username: ''
    }

    componentDidMount() {
        this.handleGetCurrentTime()
        // this.handleGetWeather()
        this.handleGetTitle(menu)
        const {username} = getUser()
        this.setState({
            username
        })
    }

    UNSAFE_componentWillUpdate(nextProps, nextState, nextContext) {
        this.handleGetTitle(menu)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleExit = ()=>{
        confirm({
            title: '你确定要退出吗?'
            , cancelText: '取消'
            , okText: '确定'
            , onOk : () =>{
                removeUser()
                this.props.history.push('/login')
            }
            , onCancel: () => {}
        });
    }

    handleGetCurrentTime = ()=>{
        this.timer = setInterval(()=>{
            const currentTime = new Date().toLocaleString()
            this.setState({currentTime})
        }, 1000)
    }

    // handleGetWeather = async ()=>{
    //     const weatherResult = await getWeather('广州')
    //     if( weatherResult.status === 'success' ){
    //         const {dayPictureUrl, weather, temperature, wind} = weatherResult['results'][0]['weather_data'][0]
    //         this.setState({
    //             dayPictureUrl
    //             , weather
    //             , temperature
    //             , wind
    //         })
    //     } else{
    //         this.handleWrongLocationInfo()
    //     }
    // }

    // handleWrongLocationInfo = ()=>{
    //     Modal.error({
    //         title: '地理位置获取错误',
    //         content: '请检查当前定位...',
    //     });
    // }

    handleGetTitle = (arr)=>{
        const url = this.props.location.pathname
        // console.log(url);
        arr.some((item)=>{
            if( item.children ){
                this.handleGetTitle(item.children)
                return false
            } else{
                const flag = new RegExp(item.route).test(url)
                if( item.route === url || flag ){
                    this.setState({
                        title: item.title
                    })
                    return true
                }
            }
            return false //单纯用来消除页面控制台警告，正常情况下不会走到这里
        })
    }

    render() {
        const {
            currentTime
            // , dayPictureUrl
            // , temperature
            // , weather
            // , wind
            // , title
            , username
        } = this.state
        return (
            <div className={'header'}>
                <div className="header-top">
                    <div className="top-box">
                        <span>Hello, {username}</span>
                        <button onClick={this.handleExit}>exit</button>
                    </div>
                </div>
                <div className="header-bottom">
                    <div className="header-title">
                        {this.props.title || this.state.title}
                    </div>
                    <div className="weather-box">
                        <span className="time">{currentTime}</span>
                        {/*<img src={dayPictureUrl} alt="" width={30} height={25}/>*/}
                        {/*<span className="weather">{weather}</span>*/}
                        {/*<span className="temperature">{temperature}</span>*/}
                        {/*<span className="wind">{wind}</span>*/}
                    </div>
                </div>
                <div className="triangle">

                </div>
            </div>
        );
    }
}

export default withRouter(MyHeader);