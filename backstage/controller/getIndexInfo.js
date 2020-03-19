const Goods = require('../schema/goodsSchema')

exports.getIndexInfo = async ctx=>{
    // console.log(ctx.query);
    const {info} = ctx.query
    const data = JSON.parse(info)
    // console.log(data);
    const {page, num, searchByName, searchByDescription} = data
    // console.log(page, num);
    const start = ( page - 1 ) * num
    let dataArr = null
        , total = null
    if( searchByName ) {    // 如果有按名称搜索的关键词
        dataArr = await Goods.find({name: new RegExp(searchByName)}).skip(start).limit(num)
        total = await Goods.find({name: new RegExp(searchByName)}).countDocuments()
    } else if( searchByDescription ){    // 如果有按描述搜索的关键词
        dataArr = await Goods.find({description: new RegExp(searchByDescription)}).skip(start).limit(num)
        total = await Goods.find({description: new RegExp(searchByDescription)}).countDocuments()
    } else{
        dataArr = await Goods.find().skip(start).limit(num)
        total = await Goods.find().countDocuments()
    }

    // console.log(dataArr, total);

    ctx.body = {
        total
        , dataArr
    }
}
