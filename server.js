var socketio = require('socket.io');
var mraa = require('./mraa.js');

function state(socket) {
    socket.emit("waterTemp" , mraa.waterTemp());
    socket.emit('tempHum', mraa.tempTest());
}

var ioServer = function (server) {
    io = socketio.listen(server); //run the socket.io server on top of the http server
    io.sockets.on('connection', function (socket) {
        socket.on('toggle', function () {
            console.log("socket io toggle");
            mraa.feed();
        });
        setInterval(state, 10000, socket);
    }
    );
};        


module.exports.listen = ioServer;