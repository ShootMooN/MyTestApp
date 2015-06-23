var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cloud = require('./cloud');

module.exports = function(){
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // 加载云代码方法
    app.use(cloud);

    require('../app/routes/index.server.routes.js')(app);

    return app;
}
