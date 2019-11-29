
// 引入express包
const express = require("express");

// 引入路由器模块
const router = require('./router');

// 验证服务器的有效性
/*
1. 微信服务器要知道开发者服务器是哪个
    - 测试号管理页面填写对应的开发者服务器地址
        - 使用ngrok内网穿透 将本地端口号开启的服务映射外网跨域访问一个网址
        - sunny.exe clientid f17f31518ab3b5a3
    - 填写token
        - 参与微信签名加密的一个参数
2. 开发者服务器 - 验证消息是否来自微信服务器
    目的：计算得出signature微信加密签名，和微信传递过来的signature进行对比，如果一样说明消息来自于微信服务器，
        如果不一样，说明不是微信服务器发送的消息
    1. 将参与微信签名的三个参数{timestamp、nonce、token} 按照字典排序并组合在一起形成一个数组
    2. 将数组里面所有参数拼接成一个字符串，进行sha1加密
    3. 加密完成就生成了一个signature，和微信发送过来的进行对比。
        - 如果一样，说明消息来自于微信服务器，返回echostr给微信服务器
        - 如果不一样，说明不是微信服务器发送的消息，返回error
*/

// 引入绝对路径
const path = require('path');

//创建app应用对象
const app = express();

// 配置模板资源目录
//app.set('views','./views');
app.set('views', path.join(__dirname, 'views'));

// 配置模板引擎
app.set('view engine','ejs');

// 应用路由器
app.use(router);
//app.use(router);


//监听端口号
app.listen(3000,() => {
    console.log('端口号监听成功了~')
})