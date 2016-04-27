function login() {
	var socket = io.connect("/");
	var data = { 
        action_type: "login",
        http_type: "POST",
        message: {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val(),
        }, 
        user_id: undefined
                
    };
    
    socket.send(JSON.stringify(data)); 

    socket.on("message",function(message){  
        
        message = JSON.parse(message);
        console.log(message); /*converting the data into JS object */
        if (message.data) {
        	document.cookie=("client_id=").concat(message.client_id);
        
            location.href = "home.html";
        } else {
            alert("There was a problem obtaining your credentials. Try again.");
        }

        $('#loginEmail').val('');
        $('#loginPassword').val('');
        
    });
}

function previewFileRegister(){
    
  var x = document.getElementById("profileImage");
  var txt = "";
  if ('files' in x) {
      if (x.files.length == 0) {
          return;
      } else {
          for (var i = 0; i < x.files.length; i++) {
              var file = x.files[i];
              if ('size' in file) {
                console.log("File size:", file.size);
              // SIZE LIMIT 2MB (Average of cellphone photo size)
                  if(file.size > 2000000) {
                    alert("Sorry, try again with a another image smaller than 1mb.");
                    return;
                  }
              }
          }
      }
  } 



  var preview = document.getElementById("profileImage");
  console.log(preview);
  var file = document.querySelector('input[type=file]').files[0]; 
  var reader = new FileReader();


  reader.onloadend = function () {
      preview.src = reader.result;
      console.log("Source:", preview.src);
      console.log(preview.src.length);
  }

  if (file) {
      reader.readAsDataURL(file); //reads the data as a URL
  } else {
      preview.src = "";
  }
}


function registerUser() {
	var socket = io.connect("/"); 

	var pass = $('#reg_password').val();
	var rpass = $("#reg_rep_password").val();

	if (pass === rpass) {
		$(".error").html("");

    var profileImage = document.getElementById("profileImage").src;

    if(profileImage ==  "http://www.mv.mu/en/forfait/img/point_interrogation.png"){
      profileImage = null;
    }
     

		var data = { 
	        action_type: "registration",
	        message: {
	            email: $('#reg_email').val(),
	            password: pass,
	            name: $('#reg_name').val(),
	            birthdate: $("#reg_dob").val(),
	            gender: $("#reg_gender option:selected").val(),
              image: profileImage

	        }, 
	        user_id: undefined      
	    };

	    data['message']['preferences'] = [];
	    $('#reg_preferences input:checked').each( function () {
	        data['message']['preferences'].push($(this).attr('name'));
	    });

	    socket.send(JSON.stringify(data)); 

	    $('#reg_password').val('');
	    $('#reg_rep_password').val('');
	    $('#reg_email').val('');
	    $('#reg_name').val('');
	    $('#reg_dob').val('');
	    $("#reg_preferences input:checked").attr('checked', false)

		socket.on("message",function(message){  
	               
	        message = JSON.parse(message);
	   
	        if (message.data) {
	          
	            openEcoForm(message.id);
	            
	        } else {
	            alert("We were not able to create your account");
	            
	        }
	    });
	} else {
		$(".notice").html("Password and Repeat Password do not match");
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


function submitEcoInfoForm() {
   var socket = io.connect("/"); 
   var responses = {
       question1: Number($("#question1").val()),
       question2: Number($("#question2").val()),
       question3: $($("input[type='radio'][name='recycle_trash_radio']:checked")[0]).val(),
       question4: Number($("#question4").val()),
       question5: Number($("#question5").val()),
       question6: $($("input[type='radio'][name='car_usage_radio']:checked")[0]).val(),
       question7: Number($("#question7").val()),
       question8: Number($("#question8").val()),
       question9: $("#question9").val()
   };

   socket.on("message",function(response){  

       response = JSON.parse(response);
       if (response.data) {
            $(".success").html("Your Eco-Information was succesfully saved");   
       } else {
            $(".error").html("We were not able to save your Eco-Information. Try it later");
       }
       
       $("#question1").val("");
       $("#question2").val("");
       $($("input[type='radio'][name='recycle_trash_radio']:checked")[0]).val("");
       $("#question4").val("");
       $("#question5").val("");
       $($("input[type='radio'][name='car_usage_radio']:checked")[0]).val("");
       $("#question7").val("");
       $("#question8").val("");
       $("#question9").val("");
       $('.form').scrollTop(0);
   });

   var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "submitEcoInfoForm",
       http_type: "POST",
       message: responses, 
       user_id: $("#userID").html()           
   };
   
   socket.send(JSON.stringify(data)); 
}