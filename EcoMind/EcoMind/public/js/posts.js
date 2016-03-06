
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

function comment(){
	alert("Commenting on post");
}


function openUserCommentBlock() {
    var html = '<form>' +
          '<div id="userCommentArea" class="' + event.target.id +'" >' +
          '<textarea id="home_user_comment_body" cols="100" rows="4" placeholder="Type your text here..."></textarea>'+
          '</div>' +
          '<button type="button" class="btn btn-lg btn-default" onclick="submitUserPost()">Post it</button>' +
        '</form>'; 
    
   		divPost = $(event.target).parent();
    	
    	divPost.append(html);
    	alert(divPost.find("#comment").html());
    	divPost.find("#comment").attr('onclick', 'comment()');
}