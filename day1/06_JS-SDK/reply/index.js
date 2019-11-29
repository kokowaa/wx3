/*

验证服务器有效性模块

*/

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

//引入sha1模块
const sha1 = require("sha1");

// // 定义配置对象
// const config = {
//     token : 'Jungyin30',
//     appID : 'wx4008ef5da04f0908',
//     appsecret : '5d23ae0bc8c5f8250a7ea547954916e0'
// }

const config = require('../config');

//引入util模块
const {getUserDataAsync,parseXmlAsync,formatMessage} = require('../utils/tool');

// 引入template 模块
const template = require('./template');

// 引入reply模块
const reply = require('./reply');





module.exports = () => {
    return async (req,res,next) => {
        // 微信服务器提交的参数
        //console.log(req.query);
    
        // 解构赋值拿到对应的参数
        const {signature,echostr,timestamp,nonce} = req.query;
        const {token} = config;

        const sha1Str = sha1([timestamp,nonce,token].sort().join(''));
    
        

        /*
            微信服务器会发送两种类型的消息给开发者服务器
            1. GET请求
                - 验证服务器的有效性
            2. POST请求
                - 微信服务器会将用户发送的数据以POST请求的方式转发到开发者服务器上
        */
       if (req.method === 'GET') {
            //3. 加密完成就生成了一个signature，和微信发送过来的进行对比。
            if(sha1Str === signature){
                //说明消息来自于微信服务器，返回echostr给微信服务器
                res.send(echostr);
            }else{
                //说明不是微信服务器发送的消息，返回error
                res.end('error');
            }
       } else if (req.method === 'POST') {
            //微信服务器会将用户发送的数据以POST请求的方式转发到开发者服务器上
            //验证消息来自于微信服务器
            if (sha1Str !== signature) {
                //消息不是微信服务器
                res.end('error');
            } 

            //console.log(req.query);
            /*
                { signature: '16dc8d6ef3e5f3c95083e6739fbd534e07b0a9b1',
                timestamp: '1574524183',
                nonce: '558223795',
                openid: 'oJjjuwGP0nXkfFtJopj_sgSpxulU' }  //用户的微信ID 
            */
           //如果开发者服务器没有回应微信服务器，微信服务器会传三次请求给开发者服务器

            //接受请求中的数据，流式数据
            const xmlData = await getUserDataAsync(req);
            //console.log(xmlData);
            /*
            
            <xml>
                <ToUserName><![CDATA[gh_24461dd826ce]]></ToUserName>  //开发者ID
                <FromUserName><![CDATA[oJjjuwGP0nXkfFtJopj_sgSpxulU]]></FromUserName>  //用户的openID
                <CreateTime>1574598193</CreateTime>    //发送的时间戳
                <MsgType><![CDATA[text]]></MsgType>    //发送的类型
                <Content><![CDATA[777]]></Content>      //发送的内容
                <MsgId>22542823554751743</MsgId>     //消息ID 微信服务器默认保存3天的用户发送数据，通过此ID 3天内可找到，三天后会被销毁
            </xml>
            
            */

            //将xml数据 解析为JS对象
            const jsData = await parseXmlAsync(xmlData);
            //console.log(jsData);
            /*
            { xml:
                { ToUserName: [ 'gh_24461dd826ce' ],
                    FromUserName: [ 'oJjjuwGP0nXkfFtJopj_sgSpxulU' ],
                    CreateTime: [ '1574599606' ],
                    MsgType: [ 'text' ],
                    Content: [ '111' ],
                    MsgId: [ '22542847858935282' ] } }
            */
           //将jsData格式化 
           const message = formatMessage(jsData);
           console.log(message);

           /**
            * 一旦遇到以下情况，微信都会在公众号会话中，向用户下发系统提示“该公众号暂时无法提供服务，请稍后再试”：
                1、开发者在5秒内未回复任何内容 
                2、开发者回复了异常数据，比如JSON数据，字符串，xml数据中有空格*****等
            */
           //console.log(message);
            const options = await reply(message);

            // JavaScript中的模板字符串
            // 最终回复用户的消息
                const replyMessage = template(options);
                console.log(replyMessage);

              // 返回回复内容给微信服务器
              res.send(replyMessage);

           //避免接口被过度调用
           //res.end('');


       } else {
            res.end('error');
       }
    
    
    
    }
}