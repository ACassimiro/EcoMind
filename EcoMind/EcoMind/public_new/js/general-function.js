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
                '<h5>NEW</h5>' +
                '<p>'+ comment + '</p>' +
            '</div>';
            console.log($(trigger).parent().parent().siblings(".comments"));
            $(trigger).parent().parent().siblings(".comments").append(newcomment);
        }
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