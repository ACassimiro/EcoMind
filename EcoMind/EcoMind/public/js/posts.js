/**
 * 
 */

function like(){
		var socket = io.connect("/"); 
	    //var userId = document.cookie.split("=")[1]; //get idol id
	    var data = { /*creating a Js ojbect to be sent to the server*/ 
	        action_type: "likePost",
	        http_type: "GET",
	        post_id: event.target.id
	    };

	    jID = "#" + event.target.id + "";
	    likeNum = $(jID).parent().find("#likeNum").html();
	    likeNum++;;
	    //likeNum++;
	    $(jID).parent().find("#likeNum").replaceWith("<a>" + likeNum + "</a>");
	    socket.send(JSON.stringify(data)); 
}

function comment(){
	alert("Commenting on post: " + event.target.id);
}
