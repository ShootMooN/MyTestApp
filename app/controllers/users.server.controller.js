var AV = require('leanengine');

exports.create = function (req, res, next) {
    var user = new AV.User();
    user.set("username", req.body.username);
    user.set("password", req.body.password);
    user.set("email", req.body.email);
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