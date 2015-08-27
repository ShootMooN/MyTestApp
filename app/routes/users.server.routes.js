var users = require('../controllers/users.server.controller'),
    passport = require('passport');

module.exports = function (app) {
    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);

    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
        }));

    app.route('/update')
        .get(users.renderUpdate)
        .post(users.update);

    app.get('/signout', users.signout);

    app.get('/oauth/wechat', passport.authenticate('wechat', {
        failureRedirect: '/signin'
    }));

    app.get('/oauth/wechat/callback', passport.authenticate('wechat',{
        failureRedirect: '/signin',
        successRedirect: '/'
    }));
};