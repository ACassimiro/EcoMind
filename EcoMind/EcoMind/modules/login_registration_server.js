var database = require('./database.js');
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
                message_to_client['id'] = user.ops[0]._id;
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

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'registration':
            registration(socket, req);
            break;
        case 'login':
        	requestLogin(socket, req);
        	break;
        case 'submitEcoInfoForm':
            submitEcoInfoForm(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;