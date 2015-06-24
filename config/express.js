var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cloud = require('./cloud');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function () {
    var app = express();

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    if(app.get('env') === 'production'){
        app.use(compress());
    }

    // 加载云代码方法
    app.use(cloud);

    require('../app/routes/index.server.routes.js')(app);

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
