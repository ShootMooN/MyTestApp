var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var AV = require('leanengine');
var User = AV.Object.extend("Guest");

module.exports = function () {
    passport.use(new LocalStrategy(function (username, password, done) {
        var query = new AV.Query(User);
        query.equalTo("username", username);
        query.equalTo("provider", "local");
        query.first({
            success: function (queryObject) {
                if (queryObject) {
                    if (queryObject.get("password") === password) {
                        return done(null, queryObject);
                    }else {
                        return done(null, false, {
                            message: 'Invalid password'
                        });
                    }
                    
                } else {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
            },
            error: function (error) {
                return done(error);
            }
        });

        //User.logIn(username, password, {
        //    success: function (user) {
        //        return done(null, user);
        //    },
        //    error: function (user, error) {
        //        return done(null, false, {
        //            message: error
        //        });
        //    }
        //});
    }));
};