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
    var async = require('async');
    database['news_posts'].getList(req.filter, req.number, function (err, posts) {
            console.log("Received the request");
            var user;
            if (err || !posts) {
                message_to_client['posts'] = null;
                message_to_client['user'] = null;
                socket.send(JSON.stringify(message_to_client));
            } else {
                // console.log(JSON.stringify(posts));
                var postContent = [];  
                
                 
                posts.forEach(function(post) {
                    if(post.likes == null){
                       likes = 0;
                    } else {
                       likes = post.likes;
                    }

                    // console.log(post.comments.length);
                   
                    if(post.comments == null){
                        comments = "No comments";
                        postContent.push(post);
                        if(postContent.length == posts.length){
                            message_to_client['posts'] = posts;
                            message_to_client['user'] = user;
                            console.log("Sending with 0 comment post")
                            socket.send(JSON.stringify(message_to_client));
                        }
                    } else {

                        console.log(posts, "and", post.comments);
                        //TODO: USE ASYNC EACH (ASYNC BLOCKS)
                        comments = post.comments + '';
                        var commentsIDs = [];

                        for(var i = 0; i<comments.length; i+=2){
                            commentsIDs.push(comments[i]);
                        }

                        // console.log(post.comments);

                        var a = [];
                        var flags = 0;
                        async.each(post.comments,
                            function(commentID, callback){
                                // console.log(commentID);
                                database['users'].getUserId(commentID.id, function (err, users) {
                                        if (err || !users) {
                                            commentID = null;
                                            console.log("Error message");
                                        } else {
                                            a.push({name: users.name, comment: commentID.comment, id: commentID.id});
                                            console.log(a.name, a.comment);
                                        }
                                        // console.log(a.length, "-", post.comments.length);
                                        if(a.length == post.comments.length){
                                            post.comments = a;
                                            postContent.push(post);
                                            flags++;
                                            // console.log(postContent);
                                        }

                                        // console.log(commentID.id);
                                        
                                        if(postContent.length == posts.length){
                                            message_to_client['posts'] = posts;
                                            message_to_client['user'] = user;
                                            console.log("Sending with commented post");
                                            socket.send(JSON.stringify(message_to_client));
                                        }

                                }); //End of database callback
                        }); //End of async
                    } // end of post.comments == null else
                    
                }); // end of posts.forEach
            }
    });
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
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;