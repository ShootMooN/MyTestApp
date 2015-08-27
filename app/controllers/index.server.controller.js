exports.render = function (req, res) {
    if (req.user)
    {
        if(req.user.get('realname'))
        {
            res.render("index", {
                title: "Hello World",
                user: JSON.stringify(req.user)
            });
        }
        else
        {
            return res.redirect("/update");
        }
    }else {
        return res.redirect("/oauth/wechat");
    }
};