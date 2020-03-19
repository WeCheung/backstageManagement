import React, {Component} from 'react';
import { Row, Col, Card, Icon, Timeline, List, Avatar } from 'antd'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/sunburst'
import 'echarts-liquidfill'
import './index.scss'

import option1 from "./option1";
import option2 from "./option2";

const data = [
    {
        title: '鸣人',
        // http://localhost:5000/avatar/1.jpg
        img:'/avatar/1.jpg',
        letters:'终于当上火影了！'
    },
    {
        title: '佐助',
        // http://localhost:5000/avatar/2.jpg
        img:'/avatar/2.jpg',
        letters:'吊车尾~~'
    },
    {
        title: '小樱',
        // http://localhost:5000/avatar/3.jpg
        img:'/avatar/3.jpg',
        letters:'佐助，你好帅！'
    },
    {
        title: '雏田',
        // http://localhost:5000/avatar/4.jpg
        img:'/avatar/4.jpg',
        letters:'鸣人君。。。那个。。。我。。喜欢你.'
    },
]

class Index extends Component {
    componentDidMount() {
        let myChart_1 = echarts.init(document.getElementById('echarts_box1'))
        myChart_1.setOption(option1)
        myChart_1.resize(836, 201)

        let myChart_2 = echarts.init(document.getElementById('echarts_box2'))
        myChart_2.setOption(option2)
        myChart_2.resize()
    }

    render() {
        return (
            <div id={'home'}>
                <Row>
                    <Col span={4}>
                        <div className="cloud_box">
                            <Card hoverable={true}>
                                <Icon
                                    type="heart"
                                    theme="filled"
                                    style={{float:'left',fontSize:'30px',color:'red'}}
                                />
                                <div className="CB_content">
                                    <p className="title">收藏</p>
                                    <p className="data">396</p>
                                </div>
                            </Card>
                        </div>

                        <div className="cloud_box" style={{marginTop:'10px'}}>
                            <Card hoverable={true}>
                                <Icon
                                    type="cloud"
                                    theme="filled"
                                    style={{float:'left',fontSize:'30px',color:'rgb(89,89,89)'}}
                                />
                                <div className="CB_content">
                                    <p className="title">云数据</p>
                                    <p className="data">30122</p>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col span={4}>
                        <div className="cloud_box">
                            <Card hoverable={true}>
                                <Icon
                                    type="camera"
                                    theme="filled"
                                    style={{float:'left',fontSize:'30px',color:'rgb(104,135,255)'}}
                                />
                                <div className="CB_content">
                                    <p className="title">照片</p>
                                    <p className="data">802</p>
                                </div>
                            </Card>
                        </div>

                        <div className="cloud_box" style={{marginTop:'10px'}}>
                            <Card hoverable={true}>
                                <Icon
                                    type="mail"
                                    theme="filled"
                                    style={{float:'left',fontSize:'30px',color:'rgb(108,199,136)'}}
                                />
                                <div className="CB_content">
                                    <p className="title">邮件</p>
                                    <p className="data">102</p>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col span={16} style={{position:'relative'}}>
                        <p className="box1_title">过去十天访问量</p>
                        <div id="echarts_box1">

                        </div>
                    </Col>
                </Row>
                <Row style={{marginTop:'20px'}}>
                    <Col span={8}>
                        <Card style={{width:'98%'}} hoverable>
                            <div className="secondLineTitleBox">
                                <p className="title">
                                    建站日志
                                </p>
                                <p className="intro">
                                    2个待完成，一个正在进行中
                                </p>
                            </div>
                            <Timeline>
                                <Timeline.Item color="blue">更多模块开发中</Timeline.Item>
                                <Timeline.Item color="red">使用TS重构(正在开发)</Timeline.Item>
                                <Timeline.Item color="green">引入Redux,Fetch</Timeline.Item>
                                <Timeline.Item color="green">引入Less,React-Router(4.x)</Timeline.Item>
                                <Timeline.Item color="green" style={{padding:0}}>初始化项目</Timeline.Item>
                            </Timeline>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{width:'98%'}} hoverable>
                            <div className="secondLineTitleBox">
                                <p className="title">
                                    消息栏
                                </p>
                            </div>
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                size={"small"}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.img} />}
                                            title={<span>{item.title}</span>}
                                            description={item.letters}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{width:'98%'}} hoverable>
                            <div className="secondLineTitleBox">
                                <p className="title">
                                    王的能力指数
                                </p>
                            </div>
                            <div id="echarts_box2">

                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Index;
