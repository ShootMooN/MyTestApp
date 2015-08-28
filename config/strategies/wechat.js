var passport = require('passport'),
    users = require('../../app/controllers/users.server.controller')
    WechatStrategy = require('passport-wechat');

module.exports = function (){
    passport.use(new WechatStrategy({
        appid: 'wxeca0bcfec760c197',
        appsecret: 'ec86d680d019c02f88d7cf80fce30d91',
        callbackURL: 'http://shootmoon.avosapps.com/oauth/wechat/callback',
        scope: 'snsapi_userinfo',
        state: true
    }, function (openid, profile, token, done) {
        console.log(JSON.stringify(profile));

        var providerUserProfile = {
            provider: 'wechat',
            providerId: openid,
            nickname: profile.nickname,
            headimgurl: profile.headimgurl
        };
        users.saveOAuthUserProfile(providerUserProfile, done);
    }));
}