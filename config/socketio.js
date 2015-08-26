var cookieParser = require('cookie-parser'),
    passport = require('passport');

module.exports = function(server, io, leanStore) {
    io.use(function(socket, next)
    {
        cookieParser('SessionSecret')(socket.request, {},
            function(err)
            {
                var sessionId = socket.request.signedCookies['connect.sid'];

                leanStore.get(sessionId, function(err, session)
                {
                    socket.request.session = session;
                    passport.initialize()(socket.request, {}, function()
                    {
                        passport.session()(socket.request, {}, function()
                        {
                            if (socket.request.user)
                            {
                                next(null, true);
                            }
                            else
                            {
                                next(new Error('User is not authenticated'), false);
                            }
                        })
                    });
                });
            });
    });

    io.on('connection', function(socket) {
        require('../app/controllers/chat.server.controller')(io, socket);
    });
};