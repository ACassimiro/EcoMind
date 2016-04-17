var database = require('./database.js');
var async = require('async');
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
                processPosts(posts, socket);
            }
        });
    }
}

function getPostList(socket, req) {
    
    var message_to_client = {};
    database['news_posts'].getList(req.filter, req.number, function (err, posts) {
        console.log("Received the request");
        
        if (err || !posts) {
            message_to_client['posts'] = null
            socket.send(JSON.stringify(message_to_client));
        } else {
            processPosts(posts, socket); 
        }
    });
}

function processPosts(posts, socket) {
    var message_to_client = {};
    var postContent = [];  
    
    console.log("Processing post");

    posts.forEach(function(post) {
        if(post.likes == null){
           likes = 0;
        } else {
           likes = post.likes;
        }
       
        if(post.comments == null){
            comments = "No comments";
            postContent.push(post);
            if(postContent.length == posts.length){
                message_to_client['posts'] = posts;
                console.log("Sending with 0 comment post")
                socket.send(JSON.stringify(message_to_client));
            }
        } else {

            comments = post.comments + '';
            var commentsIDs = [];

            for(var i = 0; i<comments.length; i+=2){
                commentsIDs.push(comments[i]);
            }

            var a = [];
            var flags = 0;
            async.each(post.comments,
                function(commentID, callback){
                    
                    database['users'].getUserId(commentID.id, function (err, users) {
                            if (err || !users) {
                                commentID = null;
                                console.log("Error message");
                            } else {
                                a.push({name: users.name, comment: commentID.comment, id: commentID.id});
                            }
                             
                            if (a.length == post.comments.length) {
                                post.comments = a;
                                postContent.push(post);
                                flags++;
                            }
                            
                            if(postContent.length == posts.length){
                                message_to_client['posts'] = posts;
                                console.log("Sending with commented post");
                                socket.send(JSON.stringify(message_to_client));
                            }

                    }); //End of database callback
            }); //End of async
        } // end of post.comments == null else
        
    }); // end of posts.forEach
}

function likePost(socket, req) {
    var message_to_client = {};
    
    database['news_posts'].incLike(req.post_id, req.user_id, function (err, posts) {
        if (err || !posts) {
            message_to_client['data'] = false;
            socket.send(JSON.stringify(message_to_client));
        } else {
            message_to_client['data'] = true;
            socket.send(JSON.stringify(message_to_client));
        }
    });
}

function dislikePost(socket, req) {
    var message_to_client = {};
    
    database['news_posts'].disLike(req.post_id, req.user_id, function (err, posts) {
        if (err || !posts) {
            message_to_client['data'] = false;
            socket.send(JSON.stringify(message_to_client));
        } else {
            message_to_client['data'] = true;
            socket.send(JSON.stringify(message_to_client));
        }
    });
}

function commentOnPost(socket, req){
    
    var message_to_client = {};
    console.log(req.post_id);
    database['news_posts'].addComment(req.post_id, req.userId, req.comment, function (err, posts) {
        if (err || !posts) {
            
            message_to_client['data'] = false;
            socket.send(JSON.stringify(message_to_client));
        } else {
            message_to_client['data'] = true;
            socket.send(JSON.stringify(message_to_client));
        }
    });
}


function getSearchPosts(socket, req) {
    
    var message_to_client = {};


    database['news_posts'].getSearchList(req.filter, req.number, function (err, posts) {
        console.log("Received the request");
        
        if (err || !posts) {
            message_to_client['posts'] = null
            socket.send(JSON.stringify(message_to_client));
        } else {
            console.log(posts);
            processPosts(posts, socket); 
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
        case 'dislikePost':
            dislikePost(socket, req);
            break;
        case 'commentOnPost':
            commentOnPost(socket, req);
            break;
        case 'getSearchPosts':
            getSearchPosts(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;