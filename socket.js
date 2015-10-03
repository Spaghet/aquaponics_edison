var socketio = require('socket.io');
var mraa = require('./mraa.js');

function state(socket) {
    socket.emit("waterTemp" , mraa.waterTemp());
    socket.emit('tempHum', mraa.tempTest());
}

var ioServer = function (server) {
    io = socketio.listen(server); //run the socket.io server on top of the http server
    io.sockets.on('connection', function (socket) {
        setInterval(state, 10000, socket);
        socket.on('control', function (data) {
            console.log(data);
            switch (data.LED) {
                case 'on': mraa.led.on(); break;
                case 'equinox': mraa.led.equinox(); break;
                case 'summer': mraa.led.summer(); break;
                case 'winter': mraa.led.winter(); break;
                case 'off': mraa.led.off(); break;
            }
            setInterval(mraa.feed(), parseInt(data.feed) * 3600000);
            setInterval(mraa.pump(), parseInt(data.pump) * 60000);

        });

        socket.on('feed', function () { mraa.feed();});
    }
    );
};        


module.exports.listen = ioServer;