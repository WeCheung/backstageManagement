const mongoose = require('mongoose')
const crypto = require('crypto');
// 设置用户表的数据格式
const userSchema = new mongoose.Schema({
    username: {
        required: true
        , type: String
    }
    , password: {
        required: true
        , type: String
    }
    , create_time: {
        type: String
        , default: Date     // 这里写 Date 或者 Date.now 都可以
    }
    , phone: {
        type: Number
        , required: true
    }
    , role: {
        type: String
        // , required: true
    }
}, {versionKey:false})

userSchema.pre('save', function (next) {
    let newPwd = crypto.createHash('sha256').update(this.password).digest('hex')
    this.password = newPwd
    next()
})

// 在端口27018下的project数据库中以 userSchema 为规则建立 user 表
module.exports = mongoose.model('users', userSchema)