exports.render = function (req, res) {
    if (req.user) {
        res.render("index", {
            title: "Hello World",
            user: JSON.stringify(req.user)
        });
    }else {
        return res.redirect("/oauth/wechat");
    }
};