var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cloud = require('./cloud');
var compress = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
//var passport = require('passport');

module.exports = function () {
    var app = express();

    if(app.get('env') === 'production'){
        app.use(compress());
    }

    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    app.use(express.static('./public'));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'SessionSecret'
    }));

    // 加载云代码方法
    app.use(cloud);

    //app.use(passport.initialize());
    //app.use(passport.session());

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/weixin.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);

    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    } else {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }

    return app;
}
