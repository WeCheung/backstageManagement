const mongoose = require('mongoose')

// 设置分类表的数据格式
const categorySchema = new mongoose.Schema({
    name: {
        required: true
        , type: String
    }
    , classId: { // 0代表1级，否则为2级
        required: true
        , type: String
    }
}, {versionKey:false})

module.exports = mongoose.model('categories', categorySchema)