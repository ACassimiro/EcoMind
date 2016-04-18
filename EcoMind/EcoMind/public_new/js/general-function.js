function closeOverlay() {
	$(".overlay").css("visibility", "hidden");
}

function openOverlay() {
	$(".overlay").css("visibility", "visible");
}

function openInput(trigger) {
	$(trigger).siblings(".comment-input").html("<input type='text' placeholder='type your text here and enter...'><button onclick='sendComment(this)'>ok</button>");
	$(trigger).attr("onclick","closeInput(this)");
	$(trigger).css("color", "#005D51");
}

function closeInput(trigger) {
	$(trigger).siblings(".comment-input").html("");
	$(trigger).attr("onclick","openInput(this)");
	$(trigger).css("color", "#717171");
}

function createSearchedUser(user){
    var htmlposts = "";
    // console.log(user.name);
    htmlposts += '<div class="post" id="' + user.name +'">';

    if(user.image == null || user.image == undefined){
        if(user.gender == "female"){
            htmlposts += '<img src="images/woman1.png" class="searchedPhoto"  id="userImg">';
        }else {
            htmlposts += '<img src="images/man1.png" class="searchedPhoto"  id="userImg">';
        }
    } else {
        htmlposts += '<img src="' + user.image + '" class="searchedPhoto" id="userImg">'
    }

    console.log(user._id);
    htmlposts +=  '<p>   </p><h3>' + user.name + '</h3>' +
                   '<br><br><button onclick="viewIdolProfile(\'' + user._id + '\');">Check Profile</button>'   +
                   '</div>';


    return htmlposts;  
}

function createPost(id, post) {

    var htmlposts = "";
    if(post.likes == null){
       likes = 0;
    } else {
       likes = post.likes;
    }

    if(post.comments == null){
       comments = [];
    } else {
       comments = post.comments;
    }

    htmlposts += '<div class="post" id="' + post._id +'">' +
       '<h2>' + post.title + '</h2>' +
       '<div class="tags">';

    var tagsize = 100/post.ecological_field.length;
    post.ecological_field.forEach(function(tag) {
        htmlposts += '<div class="' + formatEcoTags(tag) + ' tag'+Math.ceil(tagsize)+'"></div>';
    });   

    htmlposts += '</div>' +
        '<div class="content">' +
        '<p>' + post.description + '</p></br>';

    if (post.type === "news" && post.url !== null && post.url !== undefined && post.url !== "") {
        htmlposts += '<a href="'+post.url+'" target="_blank">Read more</a>';
    }    

    if (post.type === "poll") {
        post.options.forEach(function(opt) {
            htmlposts += '<input type="radio" name="radio_user_post_poll" value="' + opt +'"> ' +  opt + '</br>';
        });
        htmlposts += '</br><button onclick="pollVote(this)">Vote</button>'
       
    }
    
    htmlposts += '</div>'+
        '<hr>' +
        '<div class="social-media-buttons">';

    if ($.inArray(id, post.likesIds) === -1) {
        htmlposts += '<button onClick="like(this);"><span class="glyphicon glyphicon-thumbs-up"></span> Like</button><div id="numlikes" class="likes">' + likes + '</div>';
    } else {
        htmlposts += '<button class="cliked" onClick="dislike(this);"><span class="glyphicon glyphicon-thumbs-up"></span> Dislike</button><div id="numlikes" class="likes">' + likes + '</div>';
    }

    htmlposts += '<button onClick="openInput(this);"><span class="glyphicon glyphicon-comment"></span> Comment</button><div id="numcomments" class="likes">' + comments.length + '</div><div class="comment-input"></div>' +
        '</div>' +
        '<hr>' +
        '<div class="comments">'; 
    
    var numcom = 0;
    comments.forEach(function(c) {
        numcom = numcom + 1;

        htmlposts += '<div class="comment">' +
                '<h5>' +numcom + '</h5>' +
                '<h4>' +c.name+'</h4>' +
                '<p>'+c.comment + '</p>' +
                '</div>';
    });

    htmlposts += "</div></div>";
    return htmlposts;

}

function like(trigger) {
	var numlikes = Number($(trigger).siblings("#numlikes").html());
	
    var socket = io.connect("/"); 

    var id = $(trigger).parent().parent().attr("id")
    
    var data = { 
        action_type: "likePost",
        post_id: id,
        user_id: getCookie().client_id
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message) {  

        message = JSON.parse(message);
        if (message.data) {
            $(trigger).siblings("#numlikes").html(numlikes+1);
            $(trigger).html('<span class="glyphicon glyphicon-thumbs-up"></span> Dislike');
            $(trigger).attr("onclick","dislike(this)");
            $(trigger).css("color", "#005D51");
        }

    });

}

function dislike(trigger) {
    
    var numlikes = Number($(trigger).siblings("#numlikes").html());
    
    var socket = io.connect("/"); 

    var id = $(trigger).parent().parent().attr("id")
    
    var data = { 
        action_type: "dislikePost",
        post_id: id,
        user_id: getCookie().client_id
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message) {  

        message = JSON.parse(message);
        if (message.data) {
            $(trigger).siblings("#numlikes").html(numlikes-1);
            $(trigger).html('<span class="glyphicon glyphicon-thumbs-up"></span> Like');
            $(trigger).attr("onclick","like(this)");
            $(trigger).css("color", "#717171");
        }

    });
}

function sendComment(trigger) {
    var userId = getCookie().client_id;
    var userName = "";

    var socket = io.connect("/"); 
    
    var data = { 
        action_type: "getUserInfo",
        http_type: "GET",
        user_id: userId
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        if (message.user !== null && message.user !== undefined) {
           userName = message.user.name;
        } else {
            alert("Sorry. We could not post your comment. Try again.");
            return;
        }

        var socket = io.connect("/"); 
        
        var comment = $(trigger).siblings("input").val();
        
        var postid = $(trigger).parent().parent().parent().attr("id");

        var userId = getCookie().client_id;

        var data = {  
            action_type: "commentOnPost",
            post_id: postid,
            userId: userId,
            comment: comment
        };
        
        socket.send(JSON.stringify(data)); 
        
        socket.on("message", function(message){  

            message = JSON.parse(message);
            console.log(message);
            if (message.data) {
                $(trigger).siblings("input").val("");
                
                var newcomment = '<div class="comment">' +
                    '<h5>' + userName + '</h5>' +
                    '<p>'+ comment + '</p>' +
                '</div>';
                console.log($(trigger).parent().parent().siblings(".comments"));
                $(trigger).parent().parent().siblings(".comments").append(newcomment);
            }
        });
        
    });

    
}

function logout() {
	document.cookie = "client_id=;";
	location.href = "index.html";
}

function getCookie() {
     var obj = {};
     var str = document.cookie;
         str = str.split(';');
     for (var i = 0; i < str.length; i++) {
         var tmp = str[i].split('=');
         obj[tmp[0].replace(/ /g,'')] = tmp[1];
     }
    return obj;

}
 
function removeECookie(key) {
    var obj = getCookie();
    var keys = Object.keys(obj);
    var count = 0;
    var newCookie= ""
    keys.forEach(function (k) {
        if (k !== key) {
            if (count > 0) {
                newCookie += ";"
             }
            newCookie += k + "=" + obj[k];
            count++;
        }
        
    });
 
    document.cookie = newCookie;
}

function formatEcoTags(tag) {
	return tag.split(' ').join('-');
}