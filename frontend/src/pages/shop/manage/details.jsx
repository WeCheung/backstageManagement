import React, {Component} from 'react';
import { List, Icon, message } from 'antd';
import MyButton from "../../../components/my_button";
import {getUser} from "../../../utils/storage";
import {getUserAuthority, judgeAuthority} from "../../../api";

class Details extends Component {
    state = {
        info: {}
    }

    componentDidMount() {
        this.handleJudgeIfHasAuthority()
    }

    handleJudgeIfHasAuthority = async ()=>{
        const {username} = getUser()
        const result = await getUserAuthority(username)
        const {authority} = result.data
        const hasAuthority = judgeAuthority(this.props.history.location.pathname, authority)
        if( hasAuthority ){
            const {info} = this.props.location.state
            this.setState({ info })
        } else{
            message.error('没有权限，给爷爬！')
            this.props.history.goBack()
        }
    }

    handleGoBack = ()=>{
        this.props.history.goBack()
    }

    render() {
        const {info} = this.state
        return (
            <div className={'itemInfo'}>
                <div className="header">
                    <MyButton className={'my-button'} onClick={this.handleGoBack}>返回</MyButton>
                    <Icon type="arrow-left" style={{color: 'rgb(130, 210, 255)'}}/>
                </div>
                <List
                    size="large"
                    bordered
                >
                    <List.Item>
                        <span className="detailsTitle cannotSelect">
                            商品名称：
                        </span>
                        <span className="detailsInfo cannotSelect">
                            {info.name}
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className="detailsTitle cannotSelect">
                            商品简介：
                        </span>
                        <span className="detailsInfo cannotSelect">
                            {info.description}
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className="detailsTitle cannotSelect">
                            商品分类：
                        </span>
                        <span className="detailsInfo cannotSelect">
                            {
                                info.classification && info.classification.map((item, index)=>{
                                    if( index > 0 ){
                                        item = '/'+item
                                    }
                                    return item
                                })
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className="detailsTitle cannotSelect">
                            商品价格：
                        </span>
                        <span className="detailsInfo cannotSelect">
                            { info.price }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className="detailsTitle cannotSelect">
                            商品图片：
                        </span>
                        <span className="detailsInfo cannotSelect">
                            {
                                info.imgs && info.imgs.map((item, index)=>{
                                    // http://localhost:5000/images/
                                    const src = '/images/' + item
                                    return (<img key={index} src={src} alt="" height={150}/> )
                                })
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className="detailsTitle cannotSelect">
                            商品详述：
                        </span>
                        <span className="detailsInfo cannotSelect">
                            {<div dangerouslySetInnerHTML={{__html: info.details}}></div>}
                        </span>
                    </List.Item>
                </List>
            </div>
        );
    }
}

export default Details;