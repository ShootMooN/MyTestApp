var AV = require('leanengine');
var Chat  = AV.Object.extend('Chat');

module.exports = function(io, socket) {
    //io.emit('chatMessage', {
    //    type: 'status',
    //    text: 'connected',
    //    created: Date.now(),
    //    username: socket.request.user.get('nickname')
    //});

    var query = new AV.Query(Chat);
    query.equalTo("type", "message");
    query.ascending('createdAt');
    query.find({
        success: function(chats) {
            for(var i in chats){
                var chat = chats[i];
                socket.emit('chatMessage', {
                    type: 'message',
                    text: chats[chat].get('text'),
                    created: chats[chat].get('created'),
                    username: chats[chat].get('username'),
                    headimgurl: chats[chat].get('headimgurl')
                });
            }
        },
        error: function(error) {
        }
    });

    var user = AV.Object.createWithoutData("Guest", socket.request.user.id);
    var chat = new Chat();
    chat.set('creator', user);
    chat.set('type', 'status');
    chat.set('text', 'connected');
    chat.set('created',Date.now());
    chat.set('username', socket.request.user.get('nickname'));
    chat.set('headimgurl', socket.request.user.get('headimgurl'));
    chat.save();

    socket.on('chatMessage', function(message)
    {
        if (message.text)
        {
            message.type = 'message';
            message.created = Date.now();
            message.username = socket.request.user.get('nickname');
            message.headimgurl = socket.request.user.get('headimgurl');
            io.emit('chatMessage', message);

            var user = AV.Object.createWithoutData("Guest", socket.request.user.id);
            var chat = Chat.new(message);
            chat.set('creator', user);
            //article.set('type', message.type);
            //article.set('created', message.created);
            //article.set('username', message.username);
            //article.set('headimgurl', message.headimgurl);
            chat.save();
        }
    });

    socket.on('disconnect', function() {
        //io.emit('chatMessage', {
        //    type: 'status',
        //    text: 'disconnected',
        //    created: Date.now(),
        //    username: socket.request.user.get('nickname')
        //});

        var user = AV.Object.createWithoutData("Guest", socket.request.user.id);
        var chat = new Chat();
        chat.set('creator', user);
        chat.set('type', 'status');
        chat.set('text', 'disconnected');
        chat.set('created',Date.now());
        chat.set('username', socket.request.user.get('nickname'));
        chat.set('headimgurl', socket.request.user.get('headimgurl'));
        chat.save();
    });
};