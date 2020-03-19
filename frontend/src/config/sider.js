import Index from "../pages/index";
import Classification from "../pages/shop/classification";
import Manage from "../pages/shop/manage";
import User from "../pages/user";
import Character from "../pages/character";
import LineChart from "../pages/chart/line";
import BarChart from "../pages/chart/bar";
import PieChart from "../pages/chart/pie";

export default [
    {
        title: '首页'
        , icon: 'home'
        , route: '/admin/index'
        , component: Index
    }
    , {
        title: '商品'
        , icon: 'appstore'
        , key: 'goods'
        , children: [
            {
                title: '分类管理'
                , icon: 'table'
                , route: '/admin/classification'
                , component: Classification
            }
            , {
                title: '商品管理'
                , icon: 'tool'
                , route: '/admin/manage'
                , component: Manage
            }
        ]
    }
    , {
        title: '用户管理'
        , icon: 'user'
        , route: '/admin/user'
        , component: User
    }
    , {
        title: '角色管理'
        , icon: 'safety'
        , route: '/admin/character'
        , component: Character
    }
    , {
        title: '图形图表'
        , icon: 'area-chart'
        , key: 'chart'
        , children: [
            {
                title: '折线图'
                , icon: 'line-chart'
                , route: '/admin/line'
                , component: LineChart
            }
            , {
                title: '柱状图'
                , icon: 'bar-chart'
                , route: '/admin/bar'
                , component: BarChart
            }
            , {
                title: '饼状图'
                , icon: 'pie-chart'
                , route: '/admin/pie'
                , component: PieChart
            }
        ]
    }
]