// 网页爬取
// 引入db
const db = require('../db');
// 引入保存数据
const saveTheaters = require('./save/saveTheaters');

const theatersCrawler = require('./crawler/theatersCrawler');

(async () => {
    // 连接数据库
    await db;
    // 爬取数据
    const data = await theatersCrawler();
    // 保存数据
    await saveTheaters(data);
})()