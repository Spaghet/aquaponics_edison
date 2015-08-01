var socketio = require('socket.io');
var mraa = require('./mraa.js');

function wT() {
    socket.emit("waterTemp" ,mraa.waterTemp());
}

var ioServer = function (server) {
    io = socketio.listen(server); //run the socket.io server on top of the http server
    io.sockets.on('connection', function (socket) {
        console.log("socket io toggle");
        mraa.toggle();
        setInterval(wT, 1000);
    });
};        
