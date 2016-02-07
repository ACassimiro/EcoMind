var http = require('http');
var socketio = require('socket.io');
var config = require('./config.json');
var database = require('./modules/database.js');

function initializeServer() {
    var httpServer = http.createServer();
    httpServer.listen(config.server.httpServerPort);
    var io = socketio.listen(httpServer);
    console.log("Server succesfull created.");
    //socketApi.initialize(io);
}

// Inits the magic
database.initialize(function () {
    console.log('Initializing server');
    initializeServer();
});