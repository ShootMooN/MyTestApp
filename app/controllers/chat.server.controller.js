module.exports = function(io, socket) {
    //io.emit('chatMessage', {
    //    type: 'status',
    //    text: 'connected',
    //    created: Date.now(),
    //    username: socket.request.user.get('nickname')
    //});

    socket.on('chatMessage', function(message)
    {
        if (message.text)
        {
            message.type = 'message';
            message.created = Date.now();
            message.username = socket.request.user.get('nickname');
            message.headimgurl = socket.request.user.get('headimgurl');
            io.emit('chatMessage', message);
        }
    });

    //socket.on('disconnect', function() {
    //    io.emit('chatMessage', {
    //        type: 'status',
    //        text: 'disconnected',
    //        created: Date.now(),
    //        username: socket.request.user.get('nickname')
    //    });
    //});
};