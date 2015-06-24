var weixin = require('../controllers/weixin.server.controller');
var xml2js = require('xml2js');

// 解析微信的 xml 数据
var xmlBodyParser = function (req, res, next) {
    if (req._body)
        return next();

    req.body = req.body || {};

    // ignore GET
    if ('GET' == req.method || 'HEAD' == req.method)
        return next();

    // check Content-Type
    if ('text/xml' != req.headers['content-type'])
        return next();

    // flag as parsed
    req._body = true;

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        buf += chunk
    });
    req.on('end', function () {
        xml2js.parseString(buf, function (err, json) {
            if (err) {
                err.status = 400;
                next(err);
            } else {
                req.body = json;
                next();
            }
        });
    });
};

module.exports = function (app) {
    app.use('/weixin', xmlBodyParser);
    app.get('/weixin', function(req, res) {
        console.log('weixin req:', req.query);
        weixin.exec(req.query, function(err, data) {
            if (err) {
                return res.send(err.code || 500, err.message);
            }
            return res.send(data);
        });
    })
    app.post('/weixin', function(req, res) {
        console.log('weixin req:', req.body);
        weixin.exec(req.body, function(err, data) {
            if (err) {
                return res.send(err.code || 500, err.message);
            }
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(data);
            console.log('res:', data)
            res.set('Content-Type', 'text/xml');
            return res.send(xml);
        });
    })
};