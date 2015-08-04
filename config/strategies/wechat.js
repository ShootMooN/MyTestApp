﻿var passport = require('passport'),
    WechatStrategy = require('passport-wechat');

module.exports = function (){
    passport.use(new WechatStrategy({
        appid: 'wxeca0bcfec760c197',
        appsecret: 'ec86d680d019c02f88d7cf80fce30d91',
        callbackURL: 'http://shootmoon.avosapps.com/oauth/wechat/callback',
        scope: 'weixinCourse',
        state: true
    }, function (openid, profile, token, done) {
        var providerUserProfile = {
            provider: 'wechat',
            providerId: openid
        };
        users.saveOAuthUserProfile(providerUserProfile, done);
    }));
}