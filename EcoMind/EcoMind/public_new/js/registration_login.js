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
	            birthdate: $("#reg_dob").val(),
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
	          
	            openEcoForm(message.id);
	            
	        } else {
	            alert("We were not able to create your account");
	            
	        }
	    });
	} else {
		$(".error").html("Password and Repeat Password do not match");
	}
}

function openEcoForm(id) {
	var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "getEcoInformationQuestions",
        http_type: "GET"
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){ 
    	message = JSON.parse(message);
    	
    	var formhtml = createEcoInformationForm(message.data, id);
    	$(".overlay .ecoForm .form").html(formhtml);
 		$(".overlay").css("visibility", "visible");
    });
}

function createEcoInformationForm(info, userID) {

    var formHTML = "<div class='error'></div><div class='success'></div><br/>" +
       "<div id='userID' style='display: none;'>" + userID + "</div>";
       console.log(info);
    info.forEach(function (e) {
        formHTML += "<h3>" + e.question + "</h3>";
        if (e.type === "number") {
            formHTML +=   "<input type='text' id='" + e.flag+ "' name='" + e.ecological_field + "' /><h4>" + e.unit + "</h4><br/>"
        } else if (e.type === "radio") {
            formHTML += "<div id='"+ e.id_field + "'>";
            e.options.forEach(function (opt) {
                formHTML +=   "<input class='radio' type='radio' id='" + e.flag+ "' name='" + e.id_field + "' value='" + opt+"'/>" + opt +" <br/>"
            });
            formHTML += "</div>";
        }
    });

    return formHTML;
}

function closeOverlay() {
	$(".overlay").css("visibility", "hidden");
}