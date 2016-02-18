var database = require('./database.js');
var ecoInfo = require('./../ecoInformationQuestions.json');

var formidable = require('formidable');
var url = require('url');
var http = require('http');
var socketio = require('socket.io');

function registration(socket, req) {
    var message_to_client = {};
      
    if (req.message !== null && req.message !== undefined) {
        database['users'].add(req.message.email, req.message.password, req.message.name, req.message.birthdate, req.message.gender, req.message.preferences, function (err, user) {
            if (err || !user) {
                console.error('database.add: Could not add new user. err:', err);
                message_to_client['data'] = false;
                socket.send(JSON.stringify(message_to_client));
            } else {
                console.log('database.add: User ', req.message.email, " was successfully created", user);
                message_to_client['data'] = true;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    } 

}

function create_user_post(socket, req) {
    var message_to_client = {};
      
    if (req.message !== null && req.message !== undefined) {
        var options = null;
        if (req.message.options !== null && req.message.options !== undefined) {
            options = req.message.options;
        }
        database['news_posts'].add(req.message.user, req.message.type, req.message.ecological_field, req.message.title, req.message.description, options, function (err, post) {
            if (err || !post) {
                console.error('database.add: Could not add new post. err:', err);
                message_to_client['data'] = false;
                socket.send(JSON.stringify(message_to_client));
            } else {
                console.log('database.add: Post ', req.message.title, " was successfully created by", req.message.user);
                message_to_client['data'] = true;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    } 

}

function requestLogin(socket, req) {
	var message_to_client = {};
		
	if (req.message !== null && req.message !== undefined) {
		database['users'].check(req.message.email, req.message.password, function (err, user) {
            if (err || !user) {
                console.error('database.check: Could not authenticate user. err:', err);
                message_to_client['data'] = false;
                socket.send(JSON.stringify(message_to_client));
            } else {
                message_to_client['client_id'] = user._id;
                console.log('database.check: User ', req.message.email, " was authenticated", user);
                message_to_client['data'] = true;
                socket.send(JSON.stringify(message_to_client));
            }
        });
	}
}

function becomeAFan(socket, req) {
    var message_to_client = {};
        
    if (req.message !== null && req.message !== undefined) {
        database['users'].addFan(req.user_id, req.message.idol, function (err, user) {
            if (err || !user) {
                console.error('database.addFan: Could not add idol to user. err:', err);
                message_to_client['data'] = false;
                socket.send(JSON.stringify(message_to_client));
            } else {
                console.log('database.addFan: User ', req.user_id, " added ", req.message.idol, " as his idol");
                message_to_client['data'] = true;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    }
}

function getEcoInformationQuestions(socket, req) {
    var message_to_client = {data: ecoInfo.questions};
    socket.send(JSON.stringify(message_to_client));
}

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'registration':
            registration(socket, req);
            break;
        case 'createPost':
            create_user_post(socket, req);
            break;
        case 'login':
        	requestLogin(socket, req);
        	break;
        case 'getEcoInformationQuestions':
            getEcoInformationQuestions(socket, req);
            break;
        case 'becomeAFan':
            becomeAFan(socket, req);
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;