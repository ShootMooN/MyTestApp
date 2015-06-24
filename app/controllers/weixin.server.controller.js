var crypto = require('crypto');
var config = require('../../config/weixin.js');
var debug = require('debug')('AV:weixin');

exports.exec = function(params, cb) {
    if (params.signature) {
        checkSignature(params.signature, params.timestamp, params.nonce, params.echostr, cb);
    } else {
        receiveMessage(params, cb)
    }
}

// ��֤ǩ��
var checkSignature = function(signature, timestamp, nonce, echostr, cb) {
    var oriStr = [config.token, timestamp, nonce].sort().join('')
    var code = crypto.createHash('sha1').update(oriStr).digest('hex');
    debug('code:', code)
    if (code == signature) {
        cb(null, echostr);
    } else {
        var err = new Error('Unauthorized');
        err.code = 401;
        cb(err);
    }
}

// ������ͨ��Ϣ
var receiveMessage = function(msg, cb) {
    var result = {
        xml: {
            ToUserName: msg.xml.FromUserName[0],
            FromUserName: '' + msg.xml.ToUserName + '',
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: '��ã��㷢�������ǡ�' + msg.xml.Content + '����'
        }
    }
    cb(null, result);
}
