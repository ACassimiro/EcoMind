var database = require('./database.js');

var socketio = require('socket.io');

function createUserPost(socket, req) {
    var message_to_client = {};
      
    if (req.message !== null && req.message !== undefined) {
        var options = null;
        if (req.message.options !== null && req.message.options !== undefined) {
            options = req.message.options;
        }
        database['news_posts'].add(req.message.user, req.message.type, req.message.ecological_field, req.message.title, req.message.description, options, null, null, function (err, post) {
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

function getPostList(socket, req) {
	var message_to_client = {};
    
    database['news_posts'].getList(req.filter, req.number, function (err, posts) {
        if (err || !posts) {
            message_to_client['posts'] = null;
            socket.send(JSON.stringify(message_to_client));
        } else {
            message_to_client['posts'] = posts;
            socket.send(JSON.stringify(message_to_client));
        }
    });
}

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'createPost':
            createUserPost(socket, req);
            break;
        case 'getUserPosts':
            getUserPosts(socket, req);
            break;
        case 'getPostList':
        	getPostList(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;