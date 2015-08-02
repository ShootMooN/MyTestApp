var passport = require('passport'),
    AV = require('leanengine');

module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        var query = new AV.Query(AV.User);
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
};