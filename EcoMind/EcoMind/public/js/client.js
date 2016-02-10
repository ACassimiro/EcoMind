function submitUserPost() {
	var ecological_field = [];
	$("input[type='checkbox'][name='home_ecological_field']:checked").each( function () {
        ecological_field.push($(this).val());
    });	
    var type = $($("input[type='radio'][name='radio_user_post_type']:checked")[0]).val();
    var user = $($("#userEmailID")[0]).html();
	var message = {
        user: user,
        type: type,
        ecological_field: ecological_field,
        title: $("#home_user_post_title").val(),
        description: $("#home_user_post_body").val()
    };

    if (type === 'poll') {
    	message["options"] = [];
    	$("#pollPostOptions").children().each( function () {
    		var e = $(this).val();
    		if (e !== "") {
    			message["options"].push(e);	
    		}
            
        });
    }
    console.log(message);

    var socket = io.connect("/"); 

    socket.on("message",function(response){  

        response = JSON.parse(response);
        console.log(response); /*converting the data into JS object */
        if (response.data) {
            alert("Your post was succesfully created");
        } else {
            alert("We were not able to create your post");
        }
    });

    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "createPost",
        http_type: "POST",
        message: message, 
        user_id: user           
    };
    
    socket.send(JSON.stringify(data)); 

}

function createNewsPostsHome() {
	var posthtml = "<b>Title: </b><input id='home_user_post_title' type='text' style='width:700px'/><br/> " +
        "<textarea id='home_user_post_body' cols='90' rows='10' placeholder='Type your text here...'></textarea>";
    $( "#userPostArea" ).html(posthtml);
}

function createPollPostHome() {
	var pollhtml = "<b>Title: </b><input id='home_user_post_title' type='text' style='width:700px' /><br/>" +
        "<textarea id='home_user_post_body' cols='90' rows='1' placeholder='Type the description of your poll here...''></textarea>" +
		"<div id='pollPostOptions'></div><div id='addNewPollPostOption'><input type='text' name='poll_option'/>" +				
		"<button type='button' onclick='addPollPostOption(this)'>add</button></div>";
	$( "#userPostArea" ).html(pollhtml);
}

function addPollPostOption(trigger) {

	var newValue = $($(trigger).siblings()[0]).val();
	$($(trigger).siblings()[0]).val("");

	$("#pollPostOptions").append("<input type='radio' name='poll_options' value='"+newValue+"'>"+newValue+"<br/>");

}