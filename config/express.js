var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var AV = require('leanengine');
var passport = require('passport');
var flash = require('connect-flash');
var http = require('http');
var socketio = require('socket.io');
var LeanStore = require('./connect-leancloud')(session);

module.exports = function () {
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);

    if(app.get('env') === 'production'){
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    var leanStore = new LeanStore();

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'SessionSecret',
        store: leanStore
    }));
    
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    app.use(express.static('./public'));
    
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    // 加载云代码方法
    app.use(AV.Cloud);
    
    // 使用 avos-express-cookie-session 记录登录信息到 cookie
    //app.use(AV.Cloud.CookieSession({ secret: 'abcdefgh', maxAge: 3600000, fetchUser: false }));

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/weixin.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/articles.server.routes.js')(app);

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

    require('./socketio')(server, io, leanStore);

    return server;
}
