
/**
 * 
 * 处理用户发送的消息和内容
 * 
 */
// 引入Theaters模块
const Theaters = require('../model/Theaters');
// 引入config配置拿到路径
const {url} = require('../config');

 module.exports = async message => {
    // 定义options 
    let options = {
        toUserName : message.FromUserName,
        fromUserName : message.ToUserName,
        createTime : Date.now(),
        msgType : 'text'
    }

    // 定义一个存放回复用户的消息的变量
    let content = '你在说些啥子？我根本听不懂...麻烦你看一哈前面关注我时给你发的消息...';

    // 判断用户发送的消息是什么类型的消息
    if (message.MsgType === 'text') {
        // 判断用户发送的消息内容具体是什么
        if (message.Content === '1') {  // 全匹配
            content = '大吉大利，今晚吃鸡~';
        } else if (message.Content === '2') {
            content = '今晚王者荣耀约吗~朋友 我钻石';
        } else if (message.Content === '热门') {
            // 回复用户热门电影
            content = "热门电影我试了一下...爬取成功了...但是渲染到页面出了问题...再等等吧.."
        }  else if (message.Content.match('爱')) {  // 半匹配
            content = '我爱你~';
        } else if (message.Content.match('傻')) {  // 半匹配
            content = '你是不是傻~';
        } else if (message.Content.match('喜欢')) {  // 半匹配
            content = '喜欢喜欢喜欢~';
        } else if (message.Content === '3') {  // 全匹配
            content = '希望生活美好~';
        } else if (message.Content === '4') {  // 全匹配
            content = '不知道能不能找份好工作~';
        } else if (message.Content === '5') {  // 全匹配
            content = '跪求父母身体健康~';
        } else if (message.Content === '6') {  // 全匹配
            content = '没有BUG~';
        } else if (message.Content === '7') {  // 全匹配
            content = '希望有钱~';
        } else if (message.Content === '8') {  // 全匹配
            content = '发发发发发发~';
        } else if (message.Content === '9') {  // 全匹配
            content = '想买个域名,但我没钱了~希望有好心人资助';
        } else if (message.Content === '10') {  // 全匹配
            content = 'Life is worth living~';
        }
    } else if (message.MsgType === 'image') {
        // 用户发送的是图片
        options.msgType = 'image';
        options.mediaId = message.MediaId;
        //console.log(message.PicUrl);
    } else if (message.MsgType === 'voice') {
        // 用户发送的是语言
        options.msgType = 'voice';
        options.mediaId = message.MediaId;
        //console.log(message.Recognition);
    } else if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            // 用户订阅公众号
            content = "欢迎来到张林同学的公众号~非常感谢您的关注~" +
            '您已经关注了此公众号~\n '+
            ' 可回复数字 1——10 获取我的不同消息\n '+
            ' 点击下方菜单按钮，可进行听歌、查看天气情况等操作' ;

            if (message.EventKey) {
                content = "感谢您千辛万苦扫描二维码关注了我的公众号~";
            }

        } else if (message.Event === 'unsubscribe') {
            // 用户取消订阅
            console.log('无情取关~');
        } else if (message.Event === 'SCAN') {
            // 用户已经关注公众号
            content = "欢迎来到张林同学的公众号~非常感谢您的关注~" +
            '您已经关注了此公众号~\n '+
            ' 可回复数字 1——10 获取我的不同消息\n '+
            ' 点击下方菜单按钮，可进行听歌、查看天气情况等操作' ;
        } else if (message.Event === 'LOCATION') {
            // 用户上报地理位置
            content = `您的位置精度是 ` + message.Precision;
        } else if (message.Event === 'CLICK') {
            // 用户菜单点击事件
            if (message.EventKey === 'help'){
                content = "欢迎来到张林同学的公众号~非常感谢您的关注~" +
                '您已经关注了此公众号~\n '+
                ' 可回复数字 1——10 获取我的不同消息\n '+
                ' 点击下方菜单按钮，可进行听歌、查看天气情况等操作'  ;
            }  
        }
    }

    
    options.content = content;
    console.log(options);

    return options;


 }



