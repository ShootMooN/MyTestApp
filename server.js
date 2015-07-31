var AV = require('leanengine');

var APP_ID = process.env.LC_APP_ID || "4r8tljbmhbvl94jmkvijtwx9b9i1xdksionw4d6yik3phz7f";
var APP_KEY = process.env.LC_APP_KEY || "1f1oxamzhtrdo15oy968kwmwxtvpll06woygt1v4dnkizpcz";
var MASTER_KEY = process.env.LC_APP_MASTER_KEY || "5il95im0yll39pbdkw0kikkogoq4wx8ixsdtbunp35tgql2n";

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

var express = require('./config/express');
//var passport = require('./config/passport');
var app = express();
//var passport = passport();

// 端口一定要从环境变量 `LC_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LC_APP_PORT || 3000);
var server = app.listen(PORT, function () {
  console.log('Node app is running, port:', PORT);
});