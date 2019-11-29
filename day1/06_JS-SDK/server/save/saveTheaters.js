// 引入Theaters
const Theaters = require('../../model/Theaters');

module.exports = async data => {
    //
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const result = await Theaters.create({
            title : item.title,
            rating : item.rating,
            runTime : item.runTime,
            directors : item.directors,
            actors : item.actors,
            image : item.image,
            doubanId : item.doubanId,
            genre : item.genre,
            summary : item.summary,
            releaseDate : item.releaseDate
        })
        console.log('数据保存成功~');
        console.log(result);
    }
}   


