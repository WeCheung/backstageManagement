import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

const option1 = {
    backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: '#c86589'
    },
        {
            offset: 1,
            color: '#06a7ff'
        }
    ], false),
    title: {
        text: "访问量",
        left: "center",
        bottom: "0",
        textStyle: {
            color: "#fff",
            fontSize: 16
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '20%',
        bottom: '15%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        axisLabel: {
            margin: 30,
            color: '#ffffff63'
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: true,
            length: 25,
            lineStyle: {
                color: "#ffffff1f"
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#ffffff1f'
            }
        }
    },
    yAxis: [{
        type: 'value',
        position: 'right',
        axisLabel: {
            margin: 20,
            color: '#ffffff63'
        },

        axisTick: {
            show: true,
            length: 15,
            lineStyle: {
                color: "#ffffff1f",
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#ffffff1f'
            }
        },
        axisLine: {
            lineStyle: {
                color: '#fff',
                width: 2
            }
        }
    }],
    series: [{
        name: '访问量',
        type: 'line',
        smooth: true, //是否平滑曲线显示
        showAllSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
            normal: {
                color: "#fff", // 线条颜色
            },
        },
        label: {
            show: true,
            position: 'top',
            textStyle: {
                color: '#fff',
            }
        },
        itemStyle: {
            color: "red",
            borderColor: "#fff",
            borderWidth: 3
        },
        tooltip: {
            show: false
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#eb64fb'
                },
                    {
                        offset: 1,
                        color: '#3fbbff0d'
                    }
                ], false),
            }
        },
        data: [393, 438, 485, 631, 689, 824, 987, 1000, 1100, 1200]
    }]
    // ,dataZoom:0.8
}

export default option1
