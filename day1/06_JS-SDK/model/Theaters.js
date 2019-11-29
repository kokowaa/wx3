
// 引入mongoose模块
const mongoose = require('mongoose');
// 引入Schema对象
const Schema = mongoose.Schema;
// 创建对象
const theaterSchema = new Schema({
    title: String,
    rating: Number,
    runTime: String,
    directors: String,
    actors: String,
    image: String,
    doubanId: {
        type: Number,
        unique:true
    },
    genre: [String],
    summary: String,
    releaseDate: String,
    posterKey: String,   // 图片上传到七牛服务器，返回的Key值
    createTime: {
        type: Date,
        default: Date.now()
    } 
});
// 创建模型对象
const Theaters = mongoose.model('Theaters',theaterSchema);
// 暴露出去
module.exports = Theaters;



