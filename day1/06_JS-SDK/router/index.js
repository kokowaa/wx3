/* 
 *  路由模块
 * 
 */
// 引入express
const express = require('express');

// 引入index模块
const reply = require('../reply');

// 引入wechat模块
const Wechat = require('../wechat/weChat');

// 引入config里面的url
const {url} = require('../config');

// 引入Theaters对象
const Theaters = require('../model/Theaters');

// 引入sha1加密
const sha1 = require('sha1');

// 引入Router
const Router = express.Router;
// 创建实例对象
const router = new Router();

// 创建实例对象
const wechatApi = new Wechat();

// 随机音乐播放路由
router.get('/search', async (req,res) => {
    /**
     * 生成js-sdk使用的签名
     *  1. 组合参与签名的四个参数： jsapi_ticket(临时票据) 、 noncestr(随机字符串) 、 timestamp(时间戳) 、 url(当前服务器地址)
     *  2. 将其进行字典序排序，以“&”拼接在一起
     *  3. 进行sha1加密，最终生成signature
     * 
     */
    // 获取随机字符串
    const noncestr = Math.random().toString().split('.')[1];
    // 获取时间戳
    const timestamp = Date.now();
    console.log(timestamp);
    // 获取url地址
    // url写在config文件里面 已经引入
    // 获取票据
    const {ticket} = await wechatApi.fetchTicket();
    // 1. 组合参与签名的四个参数： jsapi_ticket(临时票据) 、 noncestr(随机字符串) 、 timestamp(时间戳) 、 url(当前服务器地址)
    // 最后还需添加路由地址 '/search'
    const arr = [
        'jsapi_ticket=' + ticket,
        'noncestr=' + noncestr,
        'timestamp=' + timestamp,
        'url=' + url + '/search'
    ]
    // 2. 将其进行字典序排序，以“&”拼接在一起
    const str = arr.sort().join('&');
    console.log(str);  // xxx=xxx&xxx=xxx&xxx=xxx
    // 3. 进行sha1加密，最终生成signature
    const signature = sha1(str);
    // 渲染页面，将渲染好的页面返回给用户
    res.render('search',{
        signature,
        noncestr,
        timestamp
    });
})

// 查询天气路由
router.get('/weather', async (req,res) => {
    // 获取随机字符串
    const noncestr = Math.random().toString().split('.')[1];
    // 获取时间戳
    const timestamp = Date.now();
    console.log(timestamp);
    // 获取url地址
    // url写在config文件里面 已经引入
    // 获取票据
    const {ticket} = await wechatApi.fetchTicket();
    // 1. 组合参与签名的四个参数： jsapi_ticket(临时票据) 、 noncestr(随机字符串) 、 timestamp(时间戳) 、 url(当前服务器地址)
    // 最后还需添加路由地址 '/search'
    const arr = [
        'jsapi_ticket=' + ticket,
        'noncestr=' + noncestr,
        'timestamp=' + timestamp,
        'url=' + url + '/weather'
    ]
    // 2. 将其进行字典序排序，以“&”拼接在一起
    const str = arr.sort().join('&');
    console.log(str);  // xxx=xxx&xxx=xxx&xxx=xxx
    // 3. 进行sha1加密，最终生成signature
    const signature = sha1(str);
    // 渲染页面，将渲染好的页面返回给用户
    res.render('weather',{
        signature,
        noncestr,
        timestamp
    });
})

// 电影详情路由
router.get('/detail', async (req,res) => {
    // 获取随机字符串
    const noncestr = Math.random().toString().split('.')[1];
    // 获取时间戳
    const timestamp = Date.now();
    console.log(timestamp);
    // 获取url地址
    // url写在config文件里面 已经引入
    // 获取票据
    const {ticket} = await wechatApi.fetchTicket();
    // 1. 组合参与签名的四个参数： jsapi_ticket(临时票据) 、 noncestr(随机字符串) 、 timestamp(时间戳) 、 url(当前服务器地址)
    // 最后还需添加路由地址 '/search'
    const arr = [
        'jsapi_ticket=' + ticket,
        'noncestr=' + noncestr,
        'timestamp=' + timestamp,
        'url=' + url + '/weather'
    ]
    // 2. 将其进行字典序排序，以“&”拼接在一起
    const str = arr.sort().join('&');
    console.log(str);  // xxx=xxx&xxx=xxx&xxx=xxx
    // 3. 进行sha1加密，最终生成signature
    const signature = sha1(str);
    // 渲染页面，将渲染好的页面返回给用户
    res.render('detail',{
        signature,
        noncestr,
        timestamp
    });
})

router.use(reply());


// 将路由暴露出去
module.exports = router;