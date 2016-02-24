var database = require('./database.js');
var ecoInfo = require('./../ecoInformationQuestions.json');

var socketio = require('socket.io');
var async = require('async');


function getEcoInformationQuestions(socket, req) {
    var message_to_client = {data: ecoInfo.questions};
    socket.send(JSON.stringify(message_to_client));
}


function requestListener(socket, req) {
  switch (req.action_type) {
        case 'getEcoInformationQuestions':
            getEcoInformationQuestions(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;