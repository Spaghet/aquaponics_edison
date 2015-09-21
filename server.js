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
        var pumpInterval, feedInterval;
        socket.on("ledControl", function (data) {
            console.log(data);
            switch (data) {
                case 'on': mraa.led.on(); break;
                case 'equinox': mraa.led.equinox(); break;
                case 'summer': mraa.led.summer(); break;
                case 'winter': mraa.led.winter(); break;
                case 'off': mraa.led.off(); break;
            }
        });
        socket.on("feedControl", function (data) {
            if (feedInterval != null) {
                clearInterval(pumpInterval);
                console.log("clear");
            }
            mraa.feed();
            feedInterval = setInterval(mraa.feed, parseInt(data) * 3600000);
        });
        socket.on("pumpControl", function (data) {
            if (pumpInterval != null) {
                clearInterval(pumpInterval);
                console.log("clear");
            }
            mraa.pump();
            pumpInterval = setInterval(mraa.pump, parseInt(data) * 60000);
        });
    });
};        

module.exports.listen = ioServer;