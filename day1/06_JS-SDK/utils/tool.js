
//工具包数据

// 引入xml2js库 此库专门把xml数据转换为js对象
const {parseString} = require('xml2js');

//引入fs模块
const {writeFile,readFile} = require('fs');
// 引入绝对路径
const {resolve} = require('path');


module.exports = {

    // 获取数据的方法
    getUserDataAsync (req) {
        return new Promise((resolve,reject) => {
            let xmlData = '';
            req
                .on('data',data => {
                    //当流式数据传递过来的时候，会触发当前事件，会将数据注入到回调函数中
                    console.log(data);
                    //获取的数据是个buffer，需要转换成字符串
                    xmlData += data.toString();

                })
                .on('end',() => {
                    //当数据接受完毕触发当前事件
                    resolve(xmlData);
                })

        })
    },

    //将xmlData数据解析为JS对象的方法
    parseXmlAsync (xmlData) {
        return new Promise((resolve,reject) => {
            //xml2js库 自带的方法
            parseString(xmlData,{trim:true},(err,data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject('parseXmlAsync方法出了问题~' + err);
                }
            })
        })
    },

    //格式化jsData数据
    formatMessage (jsData) {
        let message = {};
        // 获取xml对象
        jsData = jsData.xml;
        // 判断是否是一个对象
        if (typeof jsData === 'object') {
            // 遍历对象
            for (let key in jsData) {
                // 获取属性值
                let value = jsData[key];
                // 过滤掉空的数组
                // 注意：发现此处问题：if判断value大小 会失去一些值 暂时不使用
                //if (Array.isArray(value) && value > 0) {
                    // 将合法的数据赋值到 message 对象上面
                    message[key] = value[0];
                //}

            }
        }


        return message;
    },

    // 写文件
    writeFileAsync (data,fileName) {
        //
        //将对象字符串化
        access_token = JSON.stringify(access_token);
        const filePath = resolve(__dirname,fileName);
        //将access-token保存成一个文件
        return new Promise((resolve,reject) => {
            writeFile(filePath,data,err => {
                if(!err){
                    console.log('文件保存成功~');
                    resolve();
                }else{
                    console.log('文件保存失败~');
                    reject('writeFileAsync方法出了问题~' + err);
                }
            })
        })

    },

    // 读文件
    readFileAsync (fileName) {
        const filePath = resolve(__dirname,fileName);
        //读取本地的jsapi_ticket
        return new Promise((resolve,reject) => {
            readFile(filePath,(err,data) => {
                if(!err){
                    console.log('文件读取成功~');
                    //将JSON字符串转换为对象
                    data = JSON.parse(data);
                    resolve(data);
                }else{
                    console.log('文件读取失败~');
                    reject('readFileAsync方法出了问题~' + err);
                }
            })
        })
    }


}

//