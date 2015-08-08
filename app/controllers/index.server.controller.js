exports.render = function (req, res) {
    if (req.user) {
        res.render("index", {
            title: "Hello World",
            user: JSON.stringify({"name": req.user.get("nickname") || req.user.get("username")})
            //userFullName: req.user.get("nickname") || req.user.get("username")
        });
    }else {
        return res.redirect("/oauth/wechat");
    }

    //res.render('index', {
    //    title: 'Hello World',
    //    userFullName: req.user ? req.user.get("username") : ''
    //});
};