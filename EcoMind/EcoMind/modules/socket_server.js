var database = require('./database.js');
var ecoInfo = require('./../ecoInformationQuestions.json');

var formidable = require('formidable');
var url = require('url');
var http = require('http');
var socketio = require('socket.io');
var async = require('async');

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
                message_to_client['id'] = user.ops[0]._id;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    } 

}

function submitEcoInfoForm(socket, req) {
    var message_to_client = {};
    if (req.message !== null && req.message !== undefined) {
        
        database['users'].addUserProgress(req.user_id, req.message, function (err, progress) {
            if (err || !progress) {
                console.error('database.addUserProgress: Could not add user progress. err:', err);
                message_to_client['data'] = false;
                socket.send(JSON.stringify(message_to_client));
            } else {
                console.log('database.addUserProgress: User ', req.user_id, " progress was updated");
                message_to_client['data'] = true;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    } 
}

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

function createUserPost(socket, req) {
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

function getEcoInformationQuestions(socket, req) {
    var message_to_client = {data: ecoInfo.questions};
    socket.send(JSON.stringify(message_to_client));
}

function getUserPosts(socket, req) {
    var message_to_client = {};
        
    if (req.user_id !== null && req.user_id !== undefined) {
        database['news_posts'].getUserPosts(req.user_id, 10, function (err, posts) {
            if (err || !posts) {
                message_to_client['posts'] = null;
                socket.send(JSON.stringify(message_to_client));
            } else {
                message_to_client['posts'] = posts;
                socket.send(JSON.stringify(message_to_client));
            }
        });
    }
}

function getFansList(socket, req) {
    console.log("getFansList");
    var message_to_client = {};
        
    if (req.user_id !== null && req.user_id !== undefined) {
        database['users'].findFanList(req.user_id, function (err, fans) {
            if (err || !fans) {
                message_to_client['fans'] = null;
                socket.send(JSON.stringify(message_to_client));
            } else {
                console.log(fans);
                async.each(fans, function(fan, callback) {
                    database['users'].getUserId(fan.fan, function (err, completeFan) {
                        if (err || !completeFan) {
                            callback();
                        } else{
                            callback(completeFan);
                        }
                    });
                }, function(complete){ 
                    message_to_client['fans'] = complete;
                    socket.send(JSON.stringify(message_to_client));
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
                console.log(idols);
                async.each(idols, function(idol, callback) {
                    database['users'].getUserId(idol.idol, function (err, completeIdol) {
                        if (err || !completeIdol) {
                            callback();
                        } else{
                            callback(completeIdol);
                        }
                    });
                }, function(complete){ 
                    message_to_client['idols'] = complete;
                    socket.send(JSON.stringify(message_to_client));
                });    
            }
        });
    }
}

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'registration':
            registration(socket, req);
            break;
        case 'createPost':
            createUserPost(socket, req);
            break;
        case 'login':
        	requestLogin(socket, req);
        	break;
        case 'getEcoInformationQuestions':
            getEcoInformationQuestions(socket, req);
            break;
        case 'becomeAFan':
            becomeAFan(socket, req);
            break;
        case 'removeIdol':
            removeIdol(socket, req);
            break;
        case 'findIdol':
            findIdol(socket, req);
            break;
        case 'submitEcoInfoForm':
            submitEcoInfoForm(socket, req);
            break;
        case 'getUserInfo':
            getUserInfo(socket, req);
            break;
        case 'getUserPosts':
            getUserPosts(socket, req);
            break;
        case 'getFansList':
            getFansList(socket, req);
        case 'getIdolsList':
            getIdolsList(socket, req);
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;