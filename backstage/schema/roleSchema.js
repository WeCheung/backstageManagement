const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: String            // 角色名
    , create_time: {        // 角色创建时间
        type: String
        , default: new Date().toLocaleString()
    }
    , auth_name: String     // 授权人
    , auth_time: String     // 授权时间
    , authority: {          // 角色的权限
        type: Array
        , default: []
    }
}, {versionKey: false})

module.exports = mongoose.model('roles', roleSchema)