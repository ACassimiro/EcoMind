
function like(){
		var socket = io.connect("/"); 
		divPost = $(event.target).parent();
		
		id = divPost.attr('id');
		//alert(id);
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


function submitCommentPost(){

	var socket = io.connect("/"); 
	divPost = $(event.target).parent();
	comment = encodeURIComponent(divPost.find('#comment_body').val());
	
	id = divPost.parent().parent().attr('id');
	
	var userId = getCookie().client_id;
	// comment = userId + "," + comment;
	alert(userId);

	var data = {  
        action_type: "commentOnPost",
        http_type: "GET",
        post_id: id,
        userId: userId,
        comment: comment
    };
	
	divPost.find('#comment_body').val("");
    socket.send(JSON.stringify(data)); 
    
    socket.on("message", function(message){  

        message = JSON.parse(message);
        // Do the return of sendEmail

    }); 
    /**/
}