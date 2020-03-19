import jsonp from 'jsonp'
import axios from 'axios'
import {getUser} from "../utils/storage";

// 用于获取天气
export const getWeather = (city)=>{
    return new Promise(res=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=tCxkD4UO8P6yvebwxd5Hp2WGN8jlOTjD`
        jsonp(
            url
            ,{}
            , (err, data)=>{
                // console.log(err, data);
                if( data && data.status === 'success' ){
                    res(data)
                } else{
                    res({
                        status: 'failure'
                    })
                }
            })
    }).catch(e=>{throw e})
}

// 用于添加分类
export const postCategory = async info => {
    const {category, categoryName} = info
    const result = await axios.post('/classification/add', {
        classId: category
        , name: categoryName
    })
    return result.data
}

// 用于修改分类
export const modifyCategory = async info => {
    // console.log(info);
    const {categoryName} = info.values
    const {oldName, classId} = info
    const result = await axios.post('/classification/modify', {
        newName: categoryName
        , oldName
        , classId
    })
    return result
}

// 用于删除分类
export const deleteCategory = async info => {
    // console.log('api', info);
    const {deleteItem, classId} = info
    const result = await axios.post('/classification/delete', {
        name: deleteItem
        , classId
    })
    // console.log('api', result);
    return result
}

// 用于获取一级分类
export const getClassOne = ()=>{
    const result = axios.get('/admin/classification/getClassOne')
    return result
}

// 用于获取二级分类
export const getCategories = info=>{
    const result = axios.post('/admin/classification/getCategories', info)
    return result
}

// 用于删除已上传的图片
export const deleteImg = info => {
    const result = axios.post('/img/delete', info)
    return result
}

// 用于上传添加商品信息
export const goodsInfo = info => {
    const result = axios.post('/goods/add', info)
    return result
}

// 用于更新已上传的商品信息
export const updateInfo = info => {
    const result = axios.post('/goods/update', info)
    return result
}

// 用于获取商品管理首页商品内容
export const indexInfo = async info =>{
    // console.log('info', info);
    const result = axios.get('/manager/indexInfo', {
        params: {
            info
        }
    })
    return result
}

// 用于删除商品
export const deleteGoods = info=>{
    const result = axios.post('/goods/delete', info)
    return result
}

// 用于添加角色
export const addRoles = info=>{
    const result = axios.post('/role/add', info)
    return result
}

// 用于获取所有角色
export const getRoles = ()=>{
    const result = axios.get('/role/get')
    return result
}

// 用于设置角色权限
export const setRoleAuthority = info=>{
    const result = axios.post('/role/authority', info)
    return result
}

// 用于添加用户
export const addUser = info=>{
    const result = axios.post('/user/add', info)
    return result
}

// 用于获取所有用户
export const getUsers = ()=>{
    const result = axios.get('/user/get')
    return result
}

// 用于获取单个用户
export const getSingleUser = username=>{
    const result = axios.get('/user/single', {
        params:{
            username
        }
    })
    return result
}

// 用于更新用户
export const updateUser = info =>{
    const result = axios.post('/user/update', info)
    return result
}

// 用于删除用户
export const deleteUser = info =>{
    const result = axios.post('/user/delete', info)
    return result
}

// 用于获取用户权限
export const getUserAuthority = username=>{
    const result = axios.get('/user/authority', {
        params: {
            username
        }
    })
    return result
}

// 用于判断当前用户是否有访问该页面的权限
export const judgeAuthority = (pathname, authority)=>{
    const {username} = getUser()
    // 要获得当前用户应有的权限和当前访问的路径
    if( username === 'admin' ){
        return true
    } else if(authority && authority.includes(pathname)){
        return true
    }
    return false
}

