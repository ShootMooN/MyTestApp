var AV = require('leanengine');
var Article  = AV.Object.extend('Article');

var getErrorMessage = function(error) {
    return "Error: " + error.code + " " + error.message
};

exports.create = function(req, res) {
    var article = Article.new(req.body);
    var user = AV.Object.createWithoutData("Guest", req.user.id);
    article.set('creator', user);

    article.save(null, {
        success: function(obj) {
            res.json(article);
        },
        error: function(obj, error) {
            return res.status(400).send({
                message: getErrorMessage(error)
            });
        }
    });
};

exports.list = function(req, res) {
    var query = new AV.Query(Article);
    query.ascending('createdAt');
    query.find({
        success: function(articles) {
            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];
                var user = article.get('creator');
                //TODO:creator赋值
            }

            res.json(articles);
        },
        error: function(error) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
};

exports.articleByID = function(req, res, next, id) {
    var query = new AV.Query(Article);
    query.get(id, {
        success: function(article) {
            if(!article) {
                return next(new Error('Failed to load article ' + id));
            }else{
                req.article = article;
                next();
            }
        },
        error: function(article, error) {
            return next(getErrorMessage(error));
        }
    });
};

exports.read = function(req, res) {
    res.json(req.article);
};

exports.update = function(req, res) {
    var article = req.article;
    article.set('title', req.body.title);
    article.set('content', req.body.content);
    article.save(null, {
        success: function(obj) {
            res.json(article);
        },
        error: function(obj, error) {
            return res.status(400).send({
                message: getErrorMessage(error)
            });
        }
    });
};

exports.delete = function(req, res) {
    var article = req.article;
    article.destroy({
        success: function(obj) {
            res.json(article);
        },
        error: function(obj, error) {
            return res.status(400).send({
                message: getErrorMessage(error)
            });
        }
    });
};

exports.hasAuthorization = function(req, res, next){
    if(req.article.creator.id !== req.user.id){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
}