/**
 * 
 * 自定义菜单
 * 
 */
// 引入config模块
//const {url} = require('../config');

module.exports = {
    "button":[
        {	
            "type":"view",
            "name":"今日歌曲",
            "url":"http://zhanglin.ltd/search"
         },
         {	
            "type":"view",
            "name":"天气预报",
            "url":"http://zhanglin.ltd/weather"
        },
        {
            "name":"菜单",
            "sub_button":[
            {	
                "type":"view",
                "name":"随缘一话",
                "url":"http://zhanglin.ltd/detail"
            },
            {
                "type": "click", 
                "name": "帮助", 
                "key": "help"
                }, 
            {
                "type": "pic_photo_or_album", 
                "name": "拍照或者相册发图", 
                "key": "拍照或者相册发图"
            } 
            
            // {
            //     "type": "scancode_waitmsg", 
            //     "name": "扫码带提示", 
            //     "key": "扫码带提示"
            // }
            // {
            //     "type": "media_id", 
            //     "name": "发送图片", 
            //     "media_id": "MEDIA_ID1"
            //  }, 
            //  {
            //     "type": "view_limited", 
            //     "name": "图文消息", 
            //     "media_id": "MEDIA_ID2"
            //  }
        ]
        }
    ]
}






