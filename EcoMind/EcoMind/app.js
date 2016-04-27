var http = require('http');
var socketio = require('socket.io');
var express = require('express');

var config = require('./config.json');
var database = require('./modules/database.js');
var general_server = require('./modules/general_server.js');
var login_registration_server = require('./modules/login_registration_server.js');
var posts_news_server = require('./modules/posts_news_server.js');
var user_actions_server = require('./modules/user_actions_server.js');
var email_sender = require('./modules/email_sender.js');
var user_evolution = require('./modules/user_evolution.js');
var io;
 
 /*
 	Initializes the server, specifying the folder that contains all the Frontend size to listen for requests
 */
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
		message: everything that needs to be sent 
		user_id
	} 
*/
function requestHandler(socket){

    socket.on("message",function(data){
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        data = JSON.parse(data);
        /*
        	The data sent from the frontend size is handled for the request listeners for all those classes
        */
        general_server.requestListener(socket, data);
        email_sender.requestListener(socket, data);
        login_registration_server.requestListener(socket, data);
        posts_news_server.requestListener(socket, data);
        user_actions_server.requestListener(socket, data);
        user_evolution.requestListener(socket, data);

    });
}


// Inits the magic. Connects to the database - Similar to the main
database.initialize(function () {
    console.log('Initializing server');
    // Initialize the server
    initializeServer();
});

