
function like(){
		var socket = io.connect("/"); 
		divPost = $(event.target).parent();
		
		id = divPost.attr('id');
		alert(id);
		
	    //var userId = document.cookie.split("=")[1]; //get idol id
	    var data = { /*creating a Js ojbect to be sent to the server*/ 
	        action_type: "likePost",
	        http_type: "GET",
	        post_id: id
	    };

	    
	    likeNum = divPost.find("#likeNum").html();
	    
	    likeNum++;
	    divPost.find("#likeNum").replaceWith("<a>" + likeNum + "</a>");
	    socket.send(JSON.stringify(data)); 
}

function hideComment(){
	divPost = $(event.target).parent();
	divPost.find('#userCommentArea').hide();
	
	divPost.find("#comment").attr('onclick', 'showComment()');
}

function showComment(){
	divPost = $(event.target).parent();
	divPost.find('#userCommentArea').show();
	
	divPost.find("#comment").attr('onclick', 'hideComment()');
}


function openUserCommentBlock() {
    var html = '<div id="userCommentArea" class="' + event.target.id +'" >' +
    	'<form>' +
          '<textarea id="home_user_comment_body" cols="100" rows="4" placeholder="Type your text here..."></textarea>'+
          '<button type="button" class="btn btn-lg btn-default" onclick="submitUserPost()">Post it</button>' +
        '</form>' +
        '</div>'; 
    
   		divPost = $(event.target).parent();
    	
    	divPost.append(html);
    	divPost.find("#comment").attr('onclick', 'hideComment()');
}