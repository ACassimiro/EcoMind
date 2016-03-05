function registerUser() {
	var socket = io.connect("/"); 

	var pass = $('#reg_password').val();
	var rpass = $("#reg_rep_password").val();

	if (pass === rpass) {
		$(".error").html("");
		var data = { 
	        action_type: "registration",
	        message: {
	            email: $('#reg_email').val(),
	            password: pass,
	            name: $('#reg_name').val(),
	            birthdate: $('#reg_dob').val(),
	            gender: $("#reg_gender option:selected").val()
	        }, 
	        user_id: undefined      
	    };

	    data['message']['preferences'] = [];
	    $('#reg_preferences input:checked').each( function () {
	        data['message']['preferences'].push($(this).attr('name'));
	    });

	    socket.send(JSON.stringify(data)); 

	    $('#email').val('');
	    $('#password').val('');
	    $('#name').val('');
	    $('#dob').val('');

		socket.on("message",function(message){  
	               
	        message = JSON.parse(message);
	   
	        if (message.data) {
	          
	            showEcoFormPopUp(message.id);
	            
	        } else {
	            alert("We were not able to create your account");
	            
	        }
	    });
	} else {
		$(".error").html("Password and Repeat Password do not match");
	}

	
}