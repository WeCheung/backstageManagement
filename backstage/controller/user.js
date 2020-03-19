const User = require('../schema/userSchema')
const Role = require('../schema/roleSchema')

exports.addUser = async ctx=>{
    const {username} = ctx.request.body

    // 先判断数据库中是否已经存在该用户名
    const ifExisted = await User.findOne({username})
    if( !ifExisted ){   // 原来不存在，可以添加
        const hasAdded = await User.create(ctx.request.body)
        // console.log(hasAdded);
        if( hasAdded ){
            ctx.body = {
                status: 0
                , msg: '用户添加成功！'
            }
        } else{
            ctx.body = {
                status: 1
                , msg: '由于未知原因添加失败，请稍后再试！'
            }
        }
    } else{
        ctx.body = {
            status: 1
            , msg: '该用户已存在！'
        }
    }
}

exports.getUsers = async ctx=>{
    const users = await User.find({username:{$ne: 'admin'}})
    // console.log(users);
    ctx.body = {
        users
    }
}

exports.getSingleUser = async ctx=>{
    const {username} = ctx.query
    const theUser = await User.findOne({username})
    if( theUser ){
        ctx.body = {
            status: 0
            , user: theUser
            , msg: '用户查找成功！'
        }
    } else{
        ctx.body = {
            status: 1
            , msg: '没有此用户！'
        }
    }
}

exports.updateUser = async ctx=>{
    // console.log(ctx.request.body);
    const {_id, username} = ctx.request.body

    // 先判断更改后的名称是否与其他用户名称重复
    // const theUser = await User.findOne({_id})
    // const theUsername = theUser.username
    const ifExisted = await User.findOne({username})

    if( ifExisted && ifExisted._id != _id ){    // 允许自己的名称不变，但不可以与别人的名称重复
        ctx.body = {
            status: 1
            , msg: '用户名已存在'
        }
    } else{                                     // 允许更新
        const ifUpdateSuccessfully = await User.updateOne({_id}, ctx.request.body)
        if( ifUpdateSuccessfully.ok === 1 ){
            ctx.body = {
                status: 0
                , msg: '更新成功！'
            }
        } else{
            ctx.body = {
                status: 1
                , msg: '由于未知原因更新失败，请稍后再试！'
            }
        }
    }
}

exports.deleteUser = async ctx=>{
    const {username} = ctx.request.body
    const ifDeleteSuccessfully = await User.deleteOne({username})
    if( ifDeleteSuccessfully.ok === 1 ){
        ctx.body = {
            status: 0
            , msg: '删除成功'
        }
    } else{
        ctx.body = {
            status: 1
            , msg: '由于未知原因删除失败，请稍后再试！'
        }
    }
}

exports.getUserAuthority = async ctx=>{
    const {username} = ctx.query
    const theUser = await User.findOne({username})
    const {role} = theUser
    if( role ){     //非管理员账号
        const roleAuthority = await Role.findOne({name: role})
        const {authority} = roleAuthority
        if( roleAuthority ){
            ctx.body = {
                status: 0
                , msg: '权限查找成功！'
                , authority
            }
        }  else{
            ctx.body = {
                status: 1
                , msg: '没有该角色信息！'
            }
        }
    } else{         // 管理员账号
        ctx.body = {
            status: 3
            , msg: '欢迎管理员！'
        }
    }
}