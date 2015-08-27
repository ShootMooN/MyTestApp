var AV = require('leanengine');
var passport = require('passport');
var User  = AV.Object.extend("Guest");

var getErrorMessage = function(error) {
    return "Error: " + error.code + " " + error.message
};

exports.renderSignin = function(req, res, next) {
    if (!req.user) {
        res.render('signin', {
            title: 'Sign-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderSignup = function(req, res, next) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderUpdate = function(req, res, next) {
    if (req.user && !req.user.get('realname'))
    {
        res.render('update', {
            title: 'Update Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

exports.signup = function(req, res, next) {
    if (!req.user) {
        var user = new User();
        user.set("username", req.body.username);
        user.set("password", req.body.password);
        user.set("provider", "local");
        user.save(null, {
            success: function (user) {
                req.login(user, function(err) {
                    if (err)
                        return next(err);
                    return res.redirect('/');
                });
            },
            error: function (user, error) {
                var message = getErrorMessage(error);
                req.flash('error', message);
                return res.redirect('/signup');
            }
        });
    } else {
        return res.redirect('/');
    }
};

exports.update = function(req, res) {
    var user = req.user;
    user.set('realname', req.body.realname);
    user.save(null, {
        success: function (user) {
            return res.redirect('/');
        },
        error: function (user, error) {
            var message = getErrorMessage(error);
            req.flash('error', message);
            return res.redirect('/update');
        }
    });
};

exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.saveOAuthUserProfile = function (profile, done) {
    var query = new AV.Query(User);
    query.equalTo("username", profile.providerId);
    query.equalTo("provider", profile.provider);
    query.first({
        success: function (queryObject) {
            if (!queryObject) {
                var user = new User();
                user.set("username", profile.providerId);
                user.set("provider", profile.provider);
                user.set("nickname", profile.nickname);
                user.save(null, {
                    success: function (saveObject) {
                        return done(null, saveObject);
                    },
                    error: function (saveObject, error) {
                        return done(error);
                    }
                });
            } else {
                return done(null, queryObject);
            }
        },
        error: function (error) {
            return done(error);
        }
    });
};

exports.requiresLogin = function(req, res, next){
    if(!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }

        next();
};
    //AV.User.logIn(providerUsername, "123456", {
    //    success: function (user) {
    //        return done(null, user);
    //    },
    //    error: function (user, error) {
    //        var user = new AV.User();
    //        user.set("username", providerUsername);
    //        user.set("password", "123456");
    //        user.signUp(null, {
    //            success: function (user) {
    //                AV.User.logIn(providerUsername, "123456", {
    //                    success: function (user) {
    //                        return done(null, user);
    //                    },
    //                    error: function (user, error) {
    //                        return done(error);
    //                    }
    //                });
    //            },
    //            error: function (user, error) {
    //                return done(error);
    //            }
    //        });
    //    }
    //});
//};

/*
exports.create = function (req, res, next) {
    var user = new AV.User();
    user.set("username", req.body.username);
    user.set("password", req.body.password);
    //user.set("email", req.body.email);
    user.set("phone", req.body.phone);

    user.signUp(null, {
        success: function (user) {
            res.json(user);
        },
        error: function (user, error) {
            return next(err);
        }
    });
};

exports.list = function (req, res, next) {
    var query = new AV.Query(AV.User);
    query.find({
        success: function (users) {
            res.json(users);
        }
    });
};

exports.read = function (req, res) {
    res.json(req.user);
};

exports.userByID = function (req, res, next, id) {
    var query = new AV.Query(AV.User);
    query.equalTo("username", id);
    query.first({
        success: function (user) {
            req.user = user;
            next();
        },
        error: function (user, error) {
            return next(err);
        }
    });
};

exports.update = function (req, res, next) {
    var query = new AV.Query(AV.User);
    query.equalTo("username", req.user.id);
    query.first({
        success: function (user) {
            user.set('phone', req.body.phone, {
                error: function (user, error) {
                    return next(err);
                }
            });
            user.save();
            res.json(user);
        },
        error: function (user, error) {
            return next(err);
        }
    });
};

exports.delete = function (req, res, next) {
    req.user.destroy({
        success: function (user) {
            res.json(req.user);
        },
        error: function (user, error) {
            return next(err);
        }
    });
};*/
