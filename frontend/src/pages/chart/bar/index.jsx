import React, {Component} from 'react';
import {
    message
} from "antd";
import {getUser} from "../../../utils/storage";
import {getUserAuthority, judgeAuthority} from "../../../api";
import {Card, Button} from "antd";
import ReactEcharts from 'echarts-for-react';

class BarChart extends Component {
    state = {
        books:[1000,2000,1500,3000,2000,1200,800],//预订量
        sales:[800,1500,1300,2800,1500,1000,500],   //销量
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
            /* 做一些初始化要做的事 */
        } else{
            message.error('没有权限，给爷爬！')
            this.props.history.goBack()
        }
    }

    getOption1 = ()=>{
        let options = {
            title:{
                text:'柱形图-1',
                textStyle:{
                    color:'pink'
                }

            },
            legend: {//图例组件
                data: ['存货'],
                icon:'circle'

            },
            tooltip: {  //提示框组件
                trigger: 'axis'
            },
            xAxis:{
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            },
            yAxis:{},
            series:[
                {
                    name:'存货',
                    type:'bar', //柱形图
                    data:[1000,2000,1500,3000,2000,1200,800]
                }
            ]
        }
        return options
    }


    getOption2 = (books,sales)=>{
        let options = {
            title:{
                text:'柱形图-2',
                textStyle:{
                    color:'pink'
                }

            },
            legend: {//图例组件
                data: ['订单量','销量'],
                icon:'circle'

            },
            tooltip: {  //提示框组件
                trigger: 'axis'
            },
            xAxis:{
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            },
            yAxis:{},
            series:[    //数据源
                {
                    name:'订单量',
                    type:'bar', //柱形图
                    data:books
                },
                {
                    name:'销量',
                    type:'bar', //柱形图
                    data:sales
                }
            ]
        }
        return options
    }

    update = ()=>{
        this.setState(state=>({
            books:state.books.map(item=>item+100),
            sales:state.sales.map(item=>item-20),
        }))
    }

    render() {
        const title = <Button type={'primary'} onClick={this.update}>更新数据</Button>
        const {books,sales} = this.state
        return (
            <div>
                <Card>
                    <ReactEcharts option={this.getOption1()} />
                </Card>
                <Card title={title}>
                    <ReactEcharts option={this.getOption2(books,sales)} />
                </Card>
            </div>

        );
    }
}

export default BarChart;