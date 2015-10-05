var socketio = require('socket.io');
var mraa = require('./mraa.js');

function state(socket) {
    socket.emit("waterTemp" , mraa.waterTemp());
   // socket.emit('tempHum', mraa.tempTest());
}

var ioServer = function (server) {
    io = socketio.listen(server); //run the socket.io server on top of the http server
    io.sockets.on('connection', function (socket) {
        setInterval(state, 5000, socket);
        var feedInterval;
        var pump = mraa.pump();
        var led = mraa.led();
        socket.on("ledControl", function (data) {
            console.log(data);
            led(data.toString());
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
            pump(data.parseInt(), true);
        });
    });
};        

module.exports.listen = ioServer;