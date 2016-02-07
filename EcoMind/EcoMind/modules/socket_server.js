var database = require('./database.js');

var formidable = require('formidable');
var url = require('url');
var http = require('http');
var socketio = require('socket.io');

function registration(socket, req) {
    if (req.message !== null && req.message !== undefined) {
        database['users'].add(req.message.email, req.message.password, req.message.name, req.message.birthdate, req.message.gender, function (err, user) {
            if (err || !user) {
                console.error('database.add: Could not add new user. err:', err);
            } else {
                console.log('database.add: User ', req.message.email, " was successfully created", user);
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