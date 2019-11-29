// 引入mongoose
const mongoose = require('mongoose');
// 连接数据库
module.exports = new Promise((resolve,reject) => {
    mongoose.connect('mongodb://localhost:27017/dbMovies',{useNewUrlParser:true});
    // 绑定事件监听
    mongoose.connection.once('open',err => {
        if (!err) {
            console.log('数据库连接成功了~');
            resolve();
        } else {
            reject('数据库连接失败~' + err);
        }
    })
})