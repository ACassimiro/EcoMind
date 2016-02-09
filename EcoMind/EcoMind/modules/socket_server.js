var database = require('./database.js');

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

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'registration':
            registration(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;