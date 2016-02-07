var http = require('http');
var socketio = require('socket.io');
var express = require('express');

var config = require('./config.json');
var database = require('./modules/database.js');
var socket_server = require('./modules/socket_server.js');
var staticContent = require('./modules/static_content.js');
var io;
 
function initializeServer() {
	var app = express();
	app.use(express.static('./public'));
	//Specifying the public folder of the server to make the html accesible using the static middleware
	 
	var server = http.createServer(app).listen(config.server.httpServerPort, function(){
		console.log('app.js @', config.server.httpServerPort);
	});
	//Server listens on the port 8124
	io = socketio.listen(server); 
	/*initializing the websockets communication , server instance has to be sent as the argument */
	io.sockets.on("connection", requestHandler);

}

function requestHandler(socket){
	var message_to_client = {
        data:"Connection with the server established"
      }
      socket.send(JSON.stringify(message_to_client)); 
      /*sending data to the client , this triggers a message event at the client side */
    console.log('Socket.io Connection with the client established');
    socket.on("message",function(data){
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        data = JSON.parse(data);
 
        console.log(data);
        /*Printing the data */
        var ack_to_client = {
        data:"Server Received the message"
      }
      socket.send(JSON.stringify(ack_to_client));
        /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/
    });
}

// function initializeServer() {
//     var httpServer = http.createServer();
//     httpServer.on('request', requestListener)
//         .listen(config.server.httpServerPort, function () {
//             console.log('app.js @', config.server.httpServerPort);
//         });
//     var io = socketio.listen(httpServer);

// }


// function requestListener(req, res) {

//     var backend_modules = [
//         socket_server
//     ];

//     var _execute = function (array) {

//         for (var i = 0; i < array.length; i++) {
//             if (array[i].requestListener(req, res) === true) {
//                 return true;
//             }
//         }

//         return false;
//     };

   
//     if (_execute(backend_modules) === true) {
//         return true;
//     }
        

//     return staticContent.requestListener(req, res);

    
// }

// Inits the magic
database.initialize(function () {
    console.log('Initializing server');
    initializeServer();
});

