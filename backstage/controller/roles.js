const Roles = require('../schema/roleSchema')

exports.addRoles = async ctx=>{
    // console.log(ctx.request.body);
    const{roleName, create_time} = ctx.request.body

    // 先判断是否已经存在该角色名
    const ifExisted = await Roles.findOne({name: roleName})
    if( ifExisted ){
        ctx.body = {
            status: 1
            , msg: '该角色名已存在'
        }
    } else{
        const addSuccessfully = await Roles.create({name: roleName, create_time})
        // console.log(addSuccessfully);
        if( addSuccessfully ){  // 添加成功
            ctx.body = {
                status: 0
                , msg: '添加成功！'
            }
        } else{
            ctx.body = {
                status: 1
                , msg: '由于未知原因添加失败'
            }
        }
    }
}

exports.getRoles = async ctx=>{
    const allRoles = await Roles.find()
    // console.log(allRoles);
    if ( allRoles ){
        ctx.body = {
            status: 0
            , allRoles
            , msg: '角色查找成功！'
        }
    } else{
        ctx.body = {
            status: 1
            , msg: '由于未知原因，角色查找失败！'
        }
    }

}

exports.setRoleAuthority = async ctx=>{
    // console.log(ctx.request.body);
    const {authority, auth_name, auth_time, _id} = ctx.request.body
    const theUpdateResult = await Roles.updateOne({_id}, {
        $set:{
            auth_name
            , auth_time
            , authority
        }
    })
    // console.log(theUpdateResult);
    if( theUpdateResult.ok === 1 ){
        ctx.body={
            status: 0
            , msg: '设置成功！'
        }
    } else{
        ctx.body={
            status: 1
            , msg: '由于未知原因设置失败！'
        }
    }

}