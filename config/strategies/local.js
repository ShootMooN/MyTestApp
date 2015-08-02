var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('leanengine').User;

module.exports = function () {
    passport.use(new LocalStrategy(function (username, password, done) {
        User.logIn(username, password, {
            success: function (user) {
                return done(null, user);
            },
            error: function (user, error) {
                return done(null, false, {
                    message: error
                });
            }
        });
    }));
};