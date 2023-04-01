// 搭建express服务
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = require('./router/router')
app.use('/',router)

// 登录
const http = require('http')
const request = require('request')
const url = require('url')
const decode = require('./WXBizDataCrypt')
app.use(express.json())
app.use(bodyParser.json())

// jwt
const jwt=require('jsonwebtoken');
const expressJWT=require('express-jwt');
// 引入全局配置
const config = require('./config/config')
//config文件代码在上方
const { jwtSecretKey } = require('./config/config') 
const sqlFun = require('./db/mysql')

// post请求表单数据
app.use(express.urlencoded({extended:true}))

const multer = require('multer')
const objMulter = multer({dest:'../upload/'})
app.use(objMulter.any())
app.use(express.static('./upload/'))

//解决跨域
const cors=require('cors')
app.use(cors())

// 获取图片资源


app.get('/release',async (req,res)=>{
    // 获取到返回的用户信息
    const { iv, code, encryptedData } = req.query;

    const APP_SECRET = '11ff6978230189f3788e2a45635e7986'
    const APP_URL = 'https://api.weixin.qq.com/sns/jscode2session';
    const APP_ID = 'wxe98391debcd8bb34';
    const js_code=code;
    // 微信请求链接
    const url = `${APP_URL}?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${js_code}&grant_type=authorization_code`;
    if(code){
        request(url,async (error,response,body)=>{

            if(!error && response.statusCode == 200){
                // 获取到微信服务器返回的openid sessionKey
                let data = JSON.parse(body)
                let openid = data.openid;
                let session_key = data.session_key;
                // 解密
                let pc = new decode(openid,session_key);
                console.log('偏移量',iv);
                let decodeData = await pc.decryptData(encryptedData, iv)   //存放着要存储进数据库的数据
                res.send({decodeData})
                // 设置一个对象存放有需要的数据
                let _appid = decodeData.watermark.appid
                let _gender = decodeData.gender
                let _nickName = decodeData.nickName
                let _avatarUrl = decodeData.avatarUrl
                let arr = [_appid,_gender,_nickName,_avatarUrl]
                // console.log(arr);
                // 定义sql语句查询用户是否存在
                const sql = `select * from userinfo where user_openid = '${_appid}'`
                sqlFun(sql,null,async (result)=>{
                    // 返回结果的数组的长度为0时,将其添加到数据库
                    if(result.length === 0){
                        const sql = 'insert into userinfo(user_openid,user_gender,user_nickname,user_avatar) values (?,?,?,?)'
                        sqlFun(sql,arr,result=>{
                            if(result.affectedRows === 4){
                                res.send({
                                    status:200,
                                    msg:'添加成功'
                                })
                            }else{
                                res.send({
                                    status:500,
                                    msg:'添加失败'
                                })
                            }
                        })
                    }else{
                        // 若返回结果的数组的长度不为0,则再获取数据接口的时候看对应的appid是否更换名字或者性别,若更新,也更新数据库存储的数据
                        const sql = 'update userinfo set user_gender=?,user_nickname=?,user_avatar=? where user_openid = ?'
                        let arr = [_gender,_nickName,_avatarUrl,_appid]
                        sqlFun(sql,arr,result=>{
                            if(result){
                                return res.send({
                                    status:200,
                                    msg:'授权成功'
                                })
                            }
                        })
                    }
                })                
            }else{
                res.send('请求接口失败')
            }
        })
    }else{
        res.writeHead(404)
    }
})


// 开启监听
app.listen(9855,()=>{
    console.log('开启服务器端口9855...')
})