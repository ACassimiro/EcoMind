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
        database['news_posts'].getUserPosts(req.user_id, req.number, 10, function (err, posts) {
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
    var message = {};
    
    database['news_posts'].getList(req.filter, req.number, function (err, posts) {

            var user;
            if (err || !posts) {
                message_to_client['posts'] = null;
                message_to_client['user'] = null;
                socket.send(JSON.stringify(message_to_client));
            } else {

                posts.forEach(function(post) {
                if(post.likes == null){
                   likes = 0;
                } else {
                   likes = post.likes;
                }
               
                if(post.comments == null){
                    comments = "No comments";
                } else {


                    //TODO: USE ASYNC EACH (ASYNC BLOCKS)
                    // async.each()
                    comments = post.comments + '';
                    commentsArray = comments.split(",");
                    var comId;
                    var userInfo;
                    for(var i = 0; i<commentsArray.length; i+=2){
                        comId = commentsArray[i];

                        // database['users'].findOne({_id: new mongo.ObjectID(comId)}, );
                        // database['users'].findOne({_id: new mongo.ObjectID(comId)} );

                        // message_to_client = JSON.parse(message_to_client);
                        commentsArray[i] = JSON.stringify(user) ;
                        // commentsArray[i] = comId;
                        // commentsArray[i+1] = comId;
                    }
                    comments = commentsArray.join();
                    post.comments = comments;
                 }
            });


    
            message_to_client['posts'] = posts;
            message_to_client['user'] = user;
            socket.send(JSON.stringify(message_to_client));
        }
    });
}

function likePost(socket, req) {
    var message_to_client = {};
    
    database['news_posts'].incLike(req.post_id, function (err, posts) {
        if (err || !posts) {
            message_to_client['posts'] = null;
            socket.send(JSON.stringify(message_to_client));
        } else {
            message_to_client['posts'] = posts;
            socket.send(JSON.stringify(message_to_client));
        }
    });
}

function commentOnPost(socket, req){
    
    var message_to_client = {};
    console.log(req.post_id);
    database['news_posts'].addComment(req.post_id, req.comment, function (err, posts) {
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
        case 'likePost':
            likePost(socket, req);
            break;
        case 'commentOnPost':
            commentOnPost(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;