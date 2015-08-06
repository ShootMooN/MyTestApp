var passport = require('passport');
var AV = require('leanengine');
var User = AV.Object.extend("Guest");

module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        var query = new AV.Query(User);
        query.get(id, {
            success: function (user) {
                done(null, user);
            },
            error: function (user, error) {
                done(error, user);
            }
        });
    });
    
    require('./strategies/local.js')();
    require('./strategies/wechat.js')();
};