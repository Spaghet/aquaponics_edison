var socketio = require('socket.io');
var io;
var mraa = require('./mraa.js');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var cache = {};
var currentDate = new Date();

//toggle Led once every 10 seconds
/*
var timerLed = function (currentDate) {
    if (currentDate.getSeconds() % 10 === 0) {
        mraa.toggle();
        console.log("toggled");
    }else{ console.log("not 10 seconds");}
    setTimeout(timerLed(currentDate), 1000);
}
 */

//sends 404 not found response
function send404(response) {
    response.writeHead(404, { 'Content-type': 'text/plain' });
    response.write('Error 404: resource not found\n');
    response.end();
}

//sends file by looking up mime type from file extension
function sendFile(response, filePath, fileContents) {
    response.writeHead(
		200,
		{ "Content-type": mime.lookup(path.basename(filePath)) }
	);
    response.end(fileContents);
}

//caches file or sends 404 if file not found
function serverStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) { send404(response); }
                    else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

//da http server
var server = http.createServer(function (request, response) {
    var filePath = false;
    if (request.url == '/') {
        filePath = './public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serverStatic(response, cache, absPath);
});
server.listen(80, function () {
    console.log('Server listening on http://localhost/\n');
});


var ioServer = function (server) {
    io = socketio.listen(server); //run the socket.io server on top of the http server
    io.sockets.on('connection', function (socket) {
        console.log("socket io connection")
        socket.on('toggle', function () {
            console.log("socket io toggle");
            mraa.toggle();
        });
    });



};
ioServer(server);
mraa.feed();
