function submitUserPost(trigger) {
	var ecological_field = [];
	$("input[type='checkbox'][name='home_ecological_field']:checked").each( function () {
        ecological_field.push($(this).val());
    });	
    var user = $($("#userEmailID")[0]).html();
	var message = {
        user: user,
        type: $($("input[type='radio'][name='radio_user_post_type']:checked")[0]).val(),
        ecological_field: ecological_field,
        title: $("#home_user_post_title").val(),
        description: $("#home_user_post_body").val()
    };
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