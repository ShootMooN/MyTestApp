angular.module('chat').controller('ChatController', ['$scope',
    'Socket', '$ionicScrollDelegate',
    function($scope, Socket, $ionicScrollDelegate) {
        $scope.messages = [];

        Socket.on('chatMessage', function(message) {
            $scope.messages.push(message);
            $ionicScrollDelegate.scrollBottom();
        });

        $scope.sendMessage = function() {
            var message = {
                text: this.messageText
            };
            Socket.emit('chatMessage', message);
            this.messageText = '';
        }

        $scope.$on('$destroy', function() {
            Socket.removeListener('chatMessage');
        })
    }
]);