var database = require('./database.js');
var ecoInfo = require('./../ecoInformationQuestions.json');

var socketio = require('socket.io');
var async = require('async');


function getUserInfo(socket, req) {
    var message_to_client = {};
    if (req.user_id !== null && req.user_id !== undefined) {
        database['users'].getUserId(req.user_id, function (err, user) {
            if (err || !user) {
                console.error('database.getUserId: Could not find user id. err:', err);
                message_to_client['user'] = null;
                socket.send(JSON.stringify(message_to_client));
            } else {
                message_to_client['user'] = user;
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

function removeIdol(socket, req) {
    var message_to_client = {};
        
    if (req.message !== null && req.message !== undefined) {
        database['users'].removeIdol(req.user_id, req.message.idol, function (err, user) {
            if (err || !user) {
                console.error('database.removeIdol: Could not remove idol to user. err:', err);
                message_to_client['data'] = false;
                socket.send(JSON.stringify(message_to_client));
            } else {
                console.log('database.removeIdol: User ', req.user_id, " removed ", req.message.idol, " as his idol");
                message_to_client['data'] = true;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    }
}

function findIdol(socket, req) {
    var message_to_client = {};
        
    if (req.message !== null && req.message !== undefined) {
        database['users'].findIdol(req.user_id, req.message.idol, function (err, user) {
            if (err || !user) {
                message_to_client['data'] = false;
                socket.send(JSON.stringify(message_to_client));
            } else {
                message_to_client['data'] = true;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    }
}


function getFansList(socket, req) {
    var message_to_client = {};
        
    if (req.user_id !== null && req.user_id !== undefined) {
        database['users'].findFansList(req.user_id, function (err, fans) {
            if (err || !fans) {
                message_to_client['fans'] = null;
                socket.send(JSON.stringify(message_to_client));
            } else {
                var fansList = [];
                async.each(fans, function(fan, callback) {

                    database['users'].getUserId(fan.fan, function (err, completeFan) {
                        if (err || !completeFan) {
                            callback();
                        } else{
                            fansList.push(completeFan);
                            callback();
                        }
                    });
                }, function(){ 
                    
                    if (fansList.length == fans.length) {
                        message_to_client['fans'] = fansList;
                        socket.send(JSON.stringify(message_to_client));
                    }
                });    
            }
            
        });
    }
}

function getIdolsList(socket, req) {
    var message_to_client = {};
        
    if (req.user_id !== null && req.user_id !== undefined) {
        database['users'].findIdolsList(req.user_id, function (err, idols) {
            if (err || !idols) {
                message_to_client['idols'] = null;
                socket.send(JSON.stringify(message_to_client));
            } else {
                var idolsList = [];
                async.each(idols, function(idol, callback) {

                    database['users'].getUserId(idol.idol, function (err, completeIdol) {
                        if (err || !completeIdol) {
                            callback();
                        } else{
                            idolsList.push(completeIdol);
                            callback();
                        }
                    });
                }, function(){ 
                    
                    if (idolsList.length == idols.length) {
                        message_to_client['idols'] = idolsList;
                        socket.send(JSON.stringify(message_to_client));
                    }
                });    
            }
            
        });
    }
}


function requestListener(socket, req) {
  switch (req.action_type) {
        case 'becomeAFan':
            becomeAFan(socket, req);
            break;
        case 'removeIdol':
            removeIdol(socket, req);
            break;
        case 'findIdol':
            findIdol(socket, req);
            break;
        case 'getUserInfo':
            getUserInfo(socket, req);
            break;
        case 'getFansList':
            getFansList(socket, req);
            break;
        case 'getIdolsList':
            getIdolsList(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;