var socketio = require('socket.io');
var mraa = require('./mraa.js');

function state(socket) {
    socket.emit("waterTemp" , mraa.waterTemp());
    socket.emit('tempHum', mraa.tempTest());
}

var ioServer = function (server) {
    var io = socketio.listen(server); //run the socket.io server on top of the http server
    var wSocket;
    if (wSocket !== undefined) {
        setInterval(state, 10000, wSocket);
    }
    io.sockets.on('connection', function (socket) {
        wSocket = socket;
        var feedInterval;
        socket.on("ledControl", function (data) {
            mraa.led(data.toString());
        });
        socket.on("feedControl", function (data) {
            console.log("feed: " + data);
            if (feedInterval != null) {
                clearInterval(feedInterval);
                console.log("clear");
            }
            mraa.feed();
            feedInterval = setInterval(mraa.feed, parseInt(data) * 3600000);
        });
        socket.on("pumpControl", function (data) {
            console.log("pump: " + data + "minute intervals");
            mraa.pump(data, true);
        });
    });
};        

module.exports.listen = ioServer;