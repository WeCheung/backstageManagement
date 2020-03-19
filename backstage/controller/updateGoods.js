const Goods = require('../schema/goodsSchema')

exports.updateGoods = async ctx => {
    console.log(ctx.request.body);
    const {_id, name} = ctx.request.body
    // 要修改商品的本体已经找到，除了修改后的名字不能和已有的重了，其他任意改
    const ifExited = await Goods.findOne({name: new RegExp('^'+name+'$')})
    console.log(ifExited);
    if( ifExited ){ // 已经存在，禁止修改
        ctx.body = {
            status: 1
            , msg: '商品名称已存在！'
        }
    } else{         // 不存在，允许修改
        const result = await Goods.updateOne({_id}
            , {
                $set: ctx.request.body
            })
        // console.log(result);
        ctx.body = {
            status: 0
            , msg: '修改成功！'
        }
    }
}