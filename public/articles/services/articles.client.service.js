angular.module('articles').factory('Articles', ['$resource',
    function($resource) {
        return $resource('api/articles/:articleId', {
            articleId: '@objectId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);