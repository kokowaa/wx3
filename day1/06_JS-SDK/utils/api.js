/**
 * 
 * 放置网址的接口
 * 
 */
const preFix = 'https://api.weixin.qq.com/cgi-bin/'
module.exports = {
    accessToken : preFix + 'token?grant_type=client_credential',
    ticket : preFix + 'ticket/getticket?&type=jsapi',
    menu : {
        create : preFix + 'menu/create?',
        delete : preFix + 'menu/delete?'
    }
}