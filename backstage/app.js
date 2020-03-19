const Koa = require('koa')
const static = require('koa-static')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const multer = require('koa-multer')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto');

// 引入controller
const {getIndexInfo} = require('./controller/getIndexInfo')
const {updateGoods} = require('./controller/updateGoods')
const {addRoles, getRoles, setRoleAuthority} = require('./controller/roles')
const {addUser, getUsers, updateUser, deleteUser, getUserAuthority, getSingleUser} = require('./controller/user')

// 引入数据库
const User = require('./schema/userSchema')
const Category = require('./schema/categorySchema')
const Goods = require('./schema/goodsSchema')

// 实例化 app 和路由监听
const app = new Koa()
const router = new Router()

app.use(bodyParser())
app.use(static('public'))
// 配置路由
app.use(router.routes()).use(router.allowedMethods())

//文件上传
//配置
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    const fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
const upload = multer({ storage });

// 监听路由
// 登录
router.post('/login', async ctx=>{
    let {username, password} = 21ctx.request.body
    password = crypto.createHash('sha256').update(password).digest('hex')
    const result = await User.findOne({username, password})
    if( result ){   // 找到对象
        ctx.body = {
            status: 0
            , msg: '登录成功！'
        }
    } else{
        ctx.body = {
            status: 1
            , msg: '请检查账号和密码！'
        }
    }
})
// 增加分类
router.post('/classification/add', async ctx=>{
    const {classId, name} = ctx.request.body
    const ifHadData = await Category.findOne({name, classId})
    if( ifHadData ){    // 如果已经存在该分类则不添加
        ctx.body = {
            status: 1
            , msg: '数据库中已存在该分类'
        }
    } else{
        Category.create({
            name
            , classId
        })
        ctx.body = {
            status: 0
            , msg: '数据添加成功'
        }
    }
})
// 修改分类
router.post('/classification/modify', async ctx=>{
    // console.log(ctx.request.body);
    const {oldName, newName, classId} = ctx.request.body
    // console.log(oldName, newName);
    // 获取前台发送过来的数据之后要先验证一下数据库中是否已有这个名字
    const ifHadData = await Category.findOne({name: newName, classId})
    // console.log(ifHadData);

    if( ifHadData ){    // 如果已经存在该分类则不能修改
        ctx.body = {
            status: 1
            , msg: '已经存在该分类，请重新输入~'
        }
    } else{ // 允许修改
        // 修改一级分类的名称
        const result1 = await Category.updateOne({
                name: oldName
            }
            , {
                $set: {
                    name: newName
                }
            })
        // 修改该分类下二级分类的classId
        const result2 = await Category.updateMany({
                classId: oldName
            }
            , {
                $set: {
                    classId: newName
                }
            })

        // 判断是否真的修改成功了
        if( result1.ok == 1 && result2.ok == 1 ){
            ctx.body = {
                status: 0
                , msg: '更改成功！'
            }
        } else{
            ctx.body = {
                status: 1
                , msg: '更改时发生未知错误！'
            }
        }
    }
})
// 删除一级分类及其子集
router.post('/classification/delete', async ctx=>{
    // console.log(ctx.request.body);
    const {name, classId} = ctx.request.body
    // 如果删除的是主分类
    if( classId === '0' ){
        const result1 = await Category.deleteMany({name, classId})    // 删除该分类下的二级分类
        const result2 = await Category.deleteOne({name})        // 删除一级分类本体
        if( result1.ok == 1 && result2.ok == 1 ){
            ctx.body = {
                status: 0
                , msg: '删除成功！'
            }
        } else{
            ctx.body = {
                status: 1
                , msg: '删除时发生未知错误！'
            }
        }
    } else{ // 如果删除的是子分类
        const result = await Category.deleteOne({name, classId})
        // console.log(result);
        if( result.ok == 1 ){   // 删除成功
            ctx.body = {
                status: 0
                , msg: '删除成功！'
            }
        } else{ // 删除失败
            ctx.body = {
                status: 1
                , msg: '删除时发生未知错误！'
            }
        }
    }
})
// 获取一级分类
router.get('/admin/classification/getClassOne', async ctx=>{
    // 只获取是一级分类的
    const result = await Category.find({classId: '0'})
    ctx.body = {result}
})
// 获取相应的二级分类
router.post('/admin/classification/getCategories', async ctx=>{
    // console.log(ctx.request.body);
    const {name} = ctx.request.body
    // 获取二级分类
    const result = await Category.find({classId: name}) // 这里 result 是数据库中找到的相应的结果，以数组形式展示
    ctx.body = {result}
})
// 添加图片
router.post('/img/upload',upload.single('images'), async ctx=>{
    const name = ctx.req.file.filename
    ctx.body = {
        name    //返回文件名
        , url: `http://localhost:5000/images/${name}`
    }
})
// 删除图片
router.post('/img/delete', async ctx=>{
    // console.log(ctx.request.body);
    const {name} = ctx.request.body
    const pathname = path.join(__dirname, './public/images', name)
    const result = fs.unlinkSync(pathname)
    // console.log(result);    // 删除成功时 result 为undefined
    if( !result ){
        ctx.body = {
            status: 0
            , msg: '图片删除成功！'
        }
    } else{
        ctx.body = {
            status: 1
            , msg: '删除图片时出现未知错误！'
        }
    }
})
// 添加商品
router.post('/goods/add', async ctx=>{
    // console.log(ctx.request.body);
    const {name} = ctx.request.body
    // 先判断原来数据库中是否存在该数据
    const ifExited = await Goods.findOne({name})
    if( ifExited ){ // 如果原来已经有了那还添加个毛
        ctx.body = {
            status: 1
            , msg: '数据库中已存在该数据'
        }
    } else{
        Goods.create(ctx.request.body)
        ctx.body = {
            status: 0
            , msg: '添加成功！'
        }
    }
})
// 更新商品信息
router.post('/goods/update', updateGoods)
// 删除商品
router.post('/goods/delete', async ctx=>{
    // console.log(ctx.request.body);
    const {_id} = ctx.request.body
    const deleteResult = await Goods.deleteOne({_id})
    // console.log(deleteResult);
    if( deleteResult.ok === 1 ){
        ctx.body = {
            status: 0
            , msg: '删除成功！'
        }
    } else{
        ctx.body = {
            status: 1
            , msg: '由于未知原因删除失败，请稍后再试！'
        }
    }

})
// 获取商品管理首页商品渲染信息
router.get('/manager/indexInfo', getIndexInfo)
// 添加角色
router.post('/role/add', addRoles)
// 获取角色
router.get('/role/get', getRoles)
// 设置角色权限
router.post('/role/authority', setRoleAuthority)
// 添加用户
router.post('/user/add', addUser)
// 获取所有用户
router.get('/user/get', getUsers)
// 获取单个用户
router.get('/user/single', getSingleUser)
// 更新用户
router.post('/user/update', updateUser)
// 删除用户
router.post('/user/delete', deleteUser)
// 获取用户权限
router.get('/user/authority', getUserAuthority)

// 处理前端路由的网络请求
app.use(ctx=>{
    ctx.set('Content-Type', 'text/html; charset=UTF-8')
    const data = fs.readFileSync(__dirname+'/public/index.html')
    ctx.body = data
})

// 连接端口为27017的project数据库
mongoose.connect('mongodb://localhost:27017/project', {
    useNewUrlParser: true
    , useUnifiedTopology: true
}).then(()=>{
    console.log('数据库27017连接成功！');
    app.listen(80, ()=>{
        console.log('80端口监听成功');
    })
}).catch(err=>{
    console.log(err);
    console.log('数据库连接失败');
})

