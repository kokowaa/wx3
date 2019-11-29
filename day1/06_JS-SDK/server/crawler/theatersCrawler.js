// 引入依赖
const puppeteer = require('puppeteer');

// 定义爬取目标网页地址
const url = 'https://movie.douban.com/cinema/nowplaying/chongqing/';

// 爬取热门电影信息
module.exports = async () => {
    // 1. 打开浏览器
    const browser = await puppeteer.launch({
        args:['--no-sandbox'], 
        headless:true,      // 以无头浏览器的形式打开浏览器，没有界面显示，在后台运行
    });
    // 2. 创建tab标签页
    const page = await browser.newPage();
    // 3. 跳转到制定网址
    await page.goto(url,{
        waitUntil:'networkidle2'  // 等待网络空闲时，再跳转加载网页
    });
    // 4. 等待网页加载完成 开始爬取
    // 开启延时器，等待2秒钟 再开始爬取网页
    //await timeout();
    //
    let result = await page.evaluate(() => {
        // 对加载好的页面进行dom操作

        // 所有爬取的数据数组
        let result = [];
        // 获取所有电影热门的li
        const $list = $('#nowplaying>.mod-bd>.lists>.list-item');
        // console.log('-----');
        // console.log($list);
        // 取其中8条数据
        for (let i = 0; i < 8; i++) {
            
            const liDom = $list[i];
            // 电影标题
            let title = $(liDom).data('title');
            // 电影评分
            let rating = $(liDom).data('score');
            // 电影时长
            let runtime = $(liDom).data('duration');
            // 电影导演
            let directors = $(liDom).data('director');
            // 电影演员
            let casts = $(liDom).data('actors');
            //豆瓣id
            let doubanId = $(liDom).data('subject');
            // 电影详情页网址
            let href = $(liDom).find('.poster>a').attr('href');
            // 电影海报图
            let image = $(liDom).find('.poster>a>img').attr('src');
            //let kk = '1';
            // 添加爬取数据的内容
            result.push({
                title,
                rating,
                runtime,
                directors,
                casts,
                href,
                image,
                doubanId
            })
        }
        return result;
    })
    
    // 遍历爬取到8条数据
    for (let i = 0; i < result.length; i++) {
        // 获取每个条目信息
        let item = result[i];
        // 获取电影详情页面的地址
        let url = item.href;
        // 跳转到电影详情网址
        await page.goto(url,{
            waitUntil:'networkidle2'  // 等待网络空闲时，再跳转加载网页
        });
        // 爬取网页
        let itemResults = await page.evaluate(() => {
            //
            let genre = [];
            // 类型
            const $genre = $('[property="v:genre"]');
            for (let j = 0; j < $genre.length; j++) {
                genre.push($genre[j].innerText);  
            }
            // 简介
            const summary = $('[property="v:summary"]').html().replace(/\s+/g, '');
            //上映日期
            const releaseDate = $('[property="v:initialReleaseDate"]')[0].innerText;
            // 给单个对象添加两个属性
            return {
                genre,
                summary,
                releaseDate
            }
        })
        // 在最后给对象添加两个属性
        // 在evaluate函数中没办法读取到服务器的一些变量
        item.genre = itemResults.genre;
        item.summary = itemResults.summary;
    }
    
    console.log(result);
    // 5. 关闭网页
    await browser.close();
    // 最终全部返回出去
    return result;
}

function timeout() {
    return new Promise(resolve => setTimeout(resolve,2000))
}
