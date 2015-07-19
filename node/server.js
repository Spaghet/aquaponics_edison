var socketio = require('socket.io');
var io;
var mraa = require('./mraa.js');

exports.listen = function (server) {
    io = socketio.listen(server); //run the socket.io server on top of the http server
    io.sockets.on('connection', function (socket) {
        io.sockets.on('toggle', function () {
            mraa.toggle();
        });
    
        io.sockets.on('blink', function () {
            mraa.blink();
        });
    });
};