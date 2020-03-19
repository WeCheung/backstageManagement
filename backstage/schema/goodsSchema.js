const mongoose = require('mongoose')

const goodsSchema = new mongoose.Schema({
    name: {
        type: String
        , required: true
    }
    , description: {
        type: String
        , required: true
    }
    , price: {
        type: String
        , required: true
    }
    , classification: {
        type: Array
        , required: true
    }
    , details: String
    , imgs: [String]
}, {versionKey:false})

module.exports = mongoose.model('goods', goodsSchema)