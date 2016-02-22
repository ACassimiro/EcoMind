var http = require('http');
var socketio = require('socket.io');
var express = require('express');

var config = require('./config.json');
var database = require('./modules/database.js');
var socket_server = require('./modules/socket_server.js');
var email_sender = require('./modules/email_sender.js');
var staticContent = require('./modules/static_content.js');
var io;
 
function initializeServer() {
	var app = express();
	app.use(express.static('./public'));
	 
	var server = http.createServer(app).listen(config.server.httpServerPort, function(){
		console.log('app.js @', config.server.httpServerPort);
	});
	io = socketio.listen(server); 
	io.sockets.on("connection", requestHandler);

}

/*
	This is where the magic happens.
	The message sent from the client must be a JSON in the following format
	{
		action_type: login/registration/news_post/search
		action: function-name
		http_type: GET/POST
		message: everything that needs to be sent 
		user_email
	} 
*/
function requestHandler(socket){

    socket.on("message",function(data){
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        data = JSON.parse(data);

        socket_server.requestListener(socket, data);
        email_sender.requestListener(socket, data);

    });
}





// Inits the magic. Connects to the database
database.initialize(function () {
    console.log('Initializing server');
    // Initialize the server
    initializeServer();
});

