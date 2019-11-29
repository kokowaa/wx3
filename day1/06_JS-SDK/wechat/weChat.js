// 获取access-token
/*
什么是access-token?
    微信调用全局接口的唯一凭证

    特点：
        1. 唯一的
        2. 有效期为2小时，提前5分钟请求
        3. 接口权限每天2000次

    请求地址：https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    请求方式：Get


    设计思路：
        1. 首次本地没有，发送请求获取access-token，保存下来（本地文件）
        2. 第二次以后：
            - 去本地读取，判断其是否过期
                - 过期了： 重新请求获取access-token，保存并重新覆盖以前的access-token
                - 未过期 ： 直接使用
    整理：
        读取本地文件(readAccessToken)
            1. 有文件
                -判断其是否过期(isValidAccessToken)
                    - 过期了： 重新请求获取access-token(getAccessToken)，保存并重新覆盖以前的access-token(saveAccessToken)
                    - 未过期 ： 直接使用
            2. 没有文件
                发送请求获取access-token(getAccessToken)，保存下来（本地文件）(saveAccessToken)

*/

//引入request库
const rp = require('request-promise-native');
//引入工具函数模块
const {writeFileAsync,readFileAsync} = require('../utils/tool');


// 引入config模块
const {appID,appsecret} = require('../config');

// 引入menu模块
const menu = require('./menu');

//引入fs模块
const {writeFile,readFile} = require('fs');

// 引入绝对路径
//const {resolve} = require('path');


// 引入api模块
// const api = require('../utils/api');

//console.log(appID);

class Wechat {
    constructor () {

    }

    /*
        获取access-token
    */
   getAccessToken () {

        const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret='+appsecret;
        // 发送请求
        /*
            request
            request-promise-native 返回值是一个promise对象
        */
        return new Promise((resolve,reject) => {
            rp({ method:'GET',url,json:true })
            .then(res => {
                console.log(res);
                /*
                
                { access_token:
                    '27_BiHUgC9IjwcE0_VuBGisdGJzd5X63YzHGzLdKPLz87tw8sPeEu2WrMNqjK_A7Mo7ylqBZJxDEnI5r61sj7Yn9Iv6-atvBK2GhduvTHR-yP5c9zRDF_pPm-1iBlXkZBRTHMjL4Z97mrgZNNOECMCcACAGQG',
                    expires_in: 7200 }
                
                */
               // 设置access-token的过期时间
               res.expires_in = Date.now() + (res.expires_in -300) * 1000;
               //将promise对象的状态改为成功
               resolve(res);
            })
            .catch(err => {
                console.log(err);
                reject('getAccessToken方法出了问题~' + err);
            })
        })

        
   }

   /*
        保存access-token
        access-token为保存的凭据
    */
   savaAccessToken (access_token) {
        //
        //return writeFileAsync(access_token,'access_token.txt');
        access_token = JSON.stringify(access_token);
        //const filePath = resolve(__dirname,fileName);
        //将access-token保存成一个文件
        return new Promise((resolve,reject) => {
            writeFile('./access_token.txt',access_token,err => {
                if(!err){
                    console.log('文件保存成功~');
                    resolve();
                }else{
                    console.log('文件保存失败~');
                    reject('savaAccessToken方法出了问题~' + err);
                }
            })
        })
   }

   /*
        读取access-token
    */
   readAccessToken () {
    //
    //return readFileAsync('access_token.txt'); 
    //读取本地的jsapi_ticket
    return new Promise((resolve,reject) => {
        readFile('./access_token.txt',(err,data) => {
            if(!err){
                console.log('文件读取成功~');
                //将JSON字符串转换为对象
                data = JSON.parse(data);
                resolve(data);
            }else{
                console.log('文件读取失败~');
                reject('readAccessToken方法出了问题~' + err);
            }
        })
    })
}

    /*
        检查access-token是否有效
        data
    */
   isValidAccessToken (data) {
        // 判断传入的参数是否有效
        if(!data && !data.access_token && !data.expires_in) {
            // 代表access-token是无效的
            return false;
        }

        // 检测access-token是否在有效期内
        if( data.expires_in < Date.now() ) {
            //过期了
            return false;
        }else{
            //没有过期
            return true;
        }
        return data.expires_in < Date.now();
   }

   /*
        获取没有过期的access-token
    */
   fetchAccessToken () {
       // 优化
       if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
           //说明以前保存过access_token，并且是有效的，直接使用
           return Promise.resolve({
                access_token : this.access_token,
                expires_in : this.expires_in
           })
       }
       //是fetchAccessToken最终的返回值
        return this.readAccessToken()
            .then(async res => {
                //有文件
                //判断其是否过期
                if(this.isValidAccessToken(res)) {
                    //有效的
                    return Promise.resolve(res);
                    //resolve(res);
                }else{
                    //无效的
                    const res =await this.getAccessToken()
                            //保存下来（本地文件）
                        await  this.savaAccessToken(res)
                            //将请求回来的access-token返回出去
                        return Promise.resolve(res);
                        //resolve(res);
                }
            })
            .catch(async err => {
                //没有文件
                //发送请求获取access-token
                const res =await this.getAccessToken()
                        //保存下来（本地文件）
                    await  this.savaAccessToken(res)
                        //将请求回来的access-token返回出去
                        return Promise.resolve(res);
                    //resolve(res);
            })
            .then(res => {
                //将access-token挂载到this上
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                //返回res包装了一层promise对象(此对象为成功状态)
                //是this.readAccessToken最终的返回值
                return Promise.resolve(res);
            })
   }


   // *****************************************

   /*
        获取 jsapi_ticket 临时票据
    */
   getTicket () {
       
        return new Promise(async (resolve,reject) => {

            // 获取access-token
            const data = await this.fetchAccessToken();

            const url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ data.access_token +'&type=jsapi';
            console.log(url);

            rp({method:'GET',url,json:true})
            .then(res => {
               //将promise对象的状态改为成功
               resolve({
                   ticket : res.ticket,
                   expires_in : Date.now() + (res.expires_in -300) * 1000
               });
            })
            .catch(err => {
                console.log(err);
                reject('getTicket出了问题~' + err);
            })
        })

        
   }

   /*
        保存 jsapi_ticket
        ticket为保存的凭据
    */
   savaTicket (ticket) {
        //
        //return writeFileAsync(ticket,'ticket.txt');  
        //
        //return writeFileAsync(access_token,'access_token.txt');
        ticket = JSON.stringify(ticket);
        //const filePath = resolve(__dirname,fileName);
        //将access-token保存成一个文件
        return new Promise((resolve,reject) => {
            writeFile('./ticket.txt',ticket,err => {
                if(!err){
                    console.log('文件保存成功~');
                    resolve();
                }else{
                    console.log('文件保存失败~');
                    reject('savaTicket方法出了问题~' + err);
                }
            })
        })
   }

   /*
        读取 jsapi_ticket
    */
   readTicket () {
    //
    //return readFileAsync('ticket.txt');
    //读取本地的jsapi_ticket
    return new Promise((resolve,reject) => {
        readFile('./ticket.txt',(err,data) => {
            if(!err){
                console.log('文件读取成功~');
                //将JSON字符串转换为对象
                data = JSON.parse(data);
                resolve(data);
            }else{
                console.log('文件读取失败~');
                reject('readTicket方法出了问题~' + err);
            }
        })
    }) 
}

    /*
        检查jsapi_ticket是否有效
        data
    */
   isValidTicket (data) {
        // 判断传入的参数是否有效
        if(!data && !data.ticket && !data.expires_in) {
            // 代表access-token是无效的
            return false;
        }

        // 检测 ticket是否在有效期内
        // if( data.expires_in < Date.now() ) {
        //     //过期了
        //     return false;
        // }else{
        //     //没有过期
        //     return true;
        // }
        return data.expires_in < Date.now();
   }

   /*
        获取没有过期的jsapi_ticket
    */
   fetchTicket () {
       // 优化
       if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
           //说明以前保存过ticket，并且是有效的，直接使用
           return Promise.resolve({
                ticket : this.ticket,
                expires_in : this.expires_in
           })
       }
       //是fetchTicket最终的返回值
        return this.readTicket()
            .then(async res => {
                //有文件
                //判断其是否过期
                if(this.isValidTicket(res)) {
                    //有效的
                    return Promise.resolve(res);
                    //resolve(res);
                }else{
                    //无效的
                    const res =await this.getTicket()
                            //保存下来（本地文件）
                        await  this.savaTicket(res)
                            //将请求回来的access-token返回出去
                        return Promise.resolve(res);
                        //resolve(res);
                }
            })
            .catch(async err => {
                //没有文件
                //发送请求获取ticket
                const res =await this.getTicket()
                        //保存下来（本地文件）
                    await  this.savaTicket(res)
                        //将请求回来的ticket返回出去
                        return Promise.resolve(res);
                    //resolve(res);
            })
            .then(res => {
                //将access-token挂载到this上
                this.ticket = res.ticket;
                this.ticket_expires_in = res.expires_in;
                //返回res包装了一层promise对象(此对象为成功状态)
                //是this.readAccessToken最终的返回值
                return Promise.resolve(res);
            })
   }





   // 创建自定义菜单
   createMenu (menu) {
       // 返回一个promise对象 确保能传出结果
       return new Promise ( async (resolve,reject) => {
            try {
                // 拿到access-token
                const data = await this.fetchAccessToken();
                //定义访问地址
                const url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + data.access_token;
                // 发送请求
                const result = await rp({method:'POST',url,json:true,body:menu});
                // 返回结果
                resolve(result);
            } catch (e) {
                // 出问题抛出异常
                reject('您的createMenu方法出了问题~' + e);
            }
       })
   }

   // 删除自定义菜单
   deleteMenu () {
       //
       return new Promise ( async (resolve,reject) => {
           try {
               // 拿到access-token
                const data = await this.fetchAccessToken();
                //console.log(data.access_token);
                // 定义请求地址
                const url = 'https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=' + data.access_token;
                // 发送请求
                const result = await rp({method:'GET',url,json:true});
                // 
                resolve(result);
           } catch (e) {
                reject('deleteMenu方法出了错误~' + e);
           }

       }) 
   }

   
}



// 测试

(async () => {
    //测试
    const w = new Wechat();
    // 删除之前定义的菜单
     let result = await w.deleteMenu();
     console.log(result);
    // // 创建新的菜单
    result = await w.createMenu(menu);
    console.log(result);
    //const data =await w.fetchTicket();
    //console.log(data);
})()

module.exports = Wechat;


/*



读取本地文件(readAccessToken)
            1. 有文件
                -判断其是否过期(isValidAccessToken)
                    - 过期了： 重新请求获取access-token(getAccessToken)，保存并重新覆盖以前的access-token(saveAccessToken)
                    - 未过期 ： 直接使用
            2. 没有文件
                发送请求获取access-token(getAccessToken)，保存下来（本地文件）(saveAccessToken)

*/
// new Promise((resolve,reject) => {
//     w.readAccessToken()
//         .then(res => {
//             //有文件
//             //判断其是否过期
//             if(w.isValidAccessToken(res)) {
//                 //有效的
//                 resolve(res);
//             }else{
//                 //无效的
//                 w.getAccessToken()
//                     .then(res => {
//                         //保存下来（本地文件）
//                         w.savaAccessToken(res)
//                             .then(() => {
//                                 resolve(res);
//                             })
//                     })
//             }
//         })
//         .catch(err => {
//             //没有文件
//             //发送请求获取access-token
//             w.getAccessToken()
//                 .then(res => {
//                     //保存下来（本地文件）
//                     w.savaAccessToken(res)
//                         .then(() => {
//                             resolve(res);
//                         })
//                 })
//         })
// })
//     .then(res => {
//         console.log(res);
//     })



