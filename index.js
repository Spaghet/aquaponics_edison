var socketio = require('socket.io');
var io = require('./socket.js');
var mraa = require('./mraa.js');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var cache = {};

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

io.listen(server);