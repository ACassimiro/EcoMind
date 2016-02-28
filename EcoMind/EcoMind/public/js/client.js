function getCookie() {
    var obj = {};
    var str = document.cookie;
        str = str.split(',');
    for (var i = 0; i < str.length; i++) {
        var tmp = str[i].split('=');
        obj[tmp[0]] = tmp[1];
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
                newCookie += ","
            }
            newCookie += k + "=" + obj[k];
            count++;
        }
        
    });

    document.cookie = newCookie;
}

function submitUserPost() {
    var socket = io.connect("/"); 
	var ecological_field = [];
	$("input[type='checkbox'][name='home_ecological_field']:checked").each( function () {
        ecological_field.push($(this).val());
    });	
    var type = $($("input[type='radio'][name='radio_user_post_type']:checked")[0]).val();
    var user = getCookie().client_id;
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

    socket.on("message",function(response){  

        response = JSON.parse(response);
        if (response.data) {
            alert("Your post was succesfully created");
        } else {
            alert("We were not able to create your post");
        }
        $("#home_user_post_title").val('');
        $("#home_user_post_body").val('');
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

function initEcoInfoForm(userID) {
    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "getEcoInformationQuestions",
        http_type: "GET"
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        if (message.data) {
           createEcoInformationForm(message.data, userID);
        } else {
            alert("We had a problem, please reload the page.");
        }

    });
}

function showEcoFormPopUp(userID) {
    initEcoInfoForm(userID);
    event.preventDefault(); // disable normal link function so that it doesn't refresh the page
    var docHeight = $(document).height(); //grab the height of the page
    var scrollTop = $(window).scrollTop(); //grab the px value from the top of the page to where you're scrolling
    $('.overlay-bg').show().css({'height' : docHeight}); //display your popup background and set height to the page height
    $(".overlay-ecoform").show().css({'top': scrollTop+20+'px'}); //show the appropriate popup and set the content 20px from the window top

}


/*
[{
    question:xxx
    type: number/radio
    unit: pound
    options: ifradio
    ecological_field: 
}]

*/
function createEcoInformationForm(info, userID) {
    var formHTML = "Your account was succesfully created. Please, fill the Eco-Information Form.<br/>" +
        "<button onclick='location.href = \"login_page.html\"';>Cancel</button><br/><form>" +
        "<div id='userID' style='display: none;'>" + userID + "</div>";


    info.forEach(function (e) {
        formHTML += e.question + " ";
        if (e.type === "number") {
            formHTML +=   "<input type='text' id='" + e.flag+ "' name='" + e.ecological_field + "' />" + e.unit+" <br/>"
        } else if (e.type === "radio") {
            formHTML += "<div id='"+ e.id_field + "'>";
            e.options.forEach(function (opt) {
                formHTML +=   "<input type='radio' id='" + e.flag+ "' name='" + e.id_field + "' value='" + opt+"'/>" + opt +" <br/>"
            });
            formHTML += "</div>";
        }
    });

    formHTML += "</form><button onclick=\"submitEcoInfoForm()\">Submit</button>";   

    $(".overlay-ecoform").html(formHTML);

}

function submitEcoInfoForm() {
    var socket = io.connect("/"); 
    var responses = {
        question1: $("#question1").val(),
        question2: $("#question2").val(),
        question3: $($("input[type='radio'][name='recycle_trash_radio']:checked")[0]).val(),
        question4: $("#question4").val(),
        question5: $("#question5").val(),
        question6: $($("input[type='radio'][name='car_usage_radio']:checked")[0]).val(),
        question7: $("#question7").val(),
        question8: $("#question8").val(),
        question9: $("#question9").val()
    };

    socket.on("message",function(response){  
        var formHTML = "";

        response = JSON.parse(response);
        if (response.data) {
            formHTML += "<p>Your Eco-Information was succesfully saved</p><button onclick=\"location.href = 'login_page.html';\">OK</button>";   
        } else {
            formHTML += "<p>We were not able to save your Eco-Information. Try it later</p><button onclick=\"location.href = 'login_page.html';\">OK</button>";   
            alert("We were not able to create your post");
        }

        $("#overlay-ecoform").html(formHTML);
    });



    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "submitEcoInfoForm",
        http_type: "POST",
        message: responses, 
        user_id: $("#userID").html()           
    };
    
    socket.send(JSON.stringify(data)); 
}

function becomeFanOfOtherUser(){
    
    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "becomeAFan",
        http_type: "POST",
        message: {idol: getCookie().idol_id}, 
        user_id: getCookie().client_id 
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        if (message.data) {
           $("#becomeFanButton").html("IDOL");
           $("#becomeFanButton").attr("onclick","removeIdol()");
        } 

    });
}

function removeIdol(){
    
    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "removeIdol",
        http_type: "POST",
        message: {idol: getCookie().idol_id}, 
        user_id: getCookie().client_id 
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        if (message.data) {
           $("#becomeFanButton").html("Become a fan");
           $("#becomeFanButton").attr("onclick","becomeFanOfOtherUser()");
        } 

    });
}


function createUserProfile() {

    var userId = getCookie().client_id;

    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "getUserInfo",
        http_type: "GET",
        user_id: userId
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        if (message.user !== null && message.user !== undefined) {
           fillUserProfile(message.user);
        } else {
            alart("Sorry. We could not load the user. Try again.");
        }

    });
}

function fillUserProfile(user) {
    // Change user image
    $("#profileUserImage").html('<img src="images/spock.jpg" alt="user image" width="220" height="300" style="float:left" border=3px>'); 

    var userInfo = "<h1>" + user.name + "</h1></br>"+
                    "<p><strong>BIRTHDATE:</strong> " + user.birthdate+ "</br>" +
                    "<strong>GENDER:</strong> " + user.gender+"</br>" +
                    "<strong>EMAIL:</strong> " + user.email + "</br></p>";
    $("#profileUserInfo").html(userInfo);

    var userPreferences = "<ul>";
    user.preferences.forEach(function (preference) {
        userPreferences += "<li>" + preference + "</li>";
    });

    userPreferences += "</ul>"

    $("#profileUserPreferences").html(userPreferences);

    getUserPosts(user._id);


}

function getUserPosts(id) {

    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "getUserPosts",
        http_type: "GET",
        user_id: id
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        console.log(message);
        var htmlposts = "";
        message.posts.forEach(function(post) {
        htmlposts += '<div class="userPost">' +
                '<h3>' + post.title + '</h3>' +
                '<p>' + post.description + '</p>' +
                '</div>' 
        });
        $("#postsArea").html(htmlposts);

    });
}

function getPostList(number){
	var cookie = getCookie();
	var socket = io.connect("/"); 
	
	//alert("Inside the function");
	
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "getPostList",
        http_type: "GET",
        number: number,
        user_id: undefined
    };

    socket.send(JSON.stringify(data)); 
    
    socket.on("message", function(message){
        message = JSON.parse(message);
        console.log(message);
        var htmlposts = "";
        message.posts.forEach(function(post) {
        htmlposts += '<div class="jumbotron">' +
                '<h3>' + post.title + '</h3>' +
                '<p>' + post.description + '</p>' +
                '</div>' 
        });
        $("#postContainer").append(htmlposts);

    });
}

function createIdolProfile() {
    var socket = io.connect("/"); 
    //var userId = document.cookie.split("=")[1]; //get idol id
    var userId = getCookie().idol_id;
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "getUserInfo",
        http_type: "GET",
        user_id: userId
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        console.log(message); /*converting the data into JS object */
        if (message.user !== null && message.user !== undefined) {
            var idol = checkIdol();
            fillUserProfile(message.user);
        } else {
            alart("Sorry. We could not load the user. Try again.");
        }

    });
}

function checkIdol() {

    var socket = io.connect("/"); 

    var data = { 
        action_type: "findIdol",
        http_type: "POST",
        message: {idol: getCookie().idol_id}, 
        user_id: getCookie().client_id 
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);

        if (message.data) {
            $("#becomeFanButton").html("IDOL");
            $("#becomeFanButton").attr("onclick","removeIdol()");
        } else {
            $("#becomeFanButton").html("Become a fan");
            $("#becomeFanButton").attr("onclick","becomeFanOfOtherUser()");
        }

    });

    
}

function viewIdolProfile(id) {
    removeECookie("idol_id");
    document.cookie+=(",idol_id=").concat(id);
    location.href = 'profile_page_idol.html';
    
}

function sendEmail() {
    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "sendEmail",
        message: {
            name: $("#nameContact").val(),
            email: $("#emailContact").val(),
            msg: $("#messageContact").val()
        }, 
        user_id: getCookie().client_id 
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        // Do the return of sendEmail

    });

}

function openEditUserInfo() {
    displayHTMLOverlay(createEditUserInfo());
}

function createEditUserInfo(title) {
    var form = "<div id='edituserform'><h3>Edit User Info</h3>" +
        "<div class='edituserformitem'><h4>Edit Password</h4>" +
        "<input type='password' placeholder='old password' size=30>" +
        "<input type='password' placeholder='new password' size=30>" +
        "<input type='password' placeholder='repeat new password' size=30>" +
        "<button onclick='editPassword(this);'>Edit</button></div>"+
        "<div class='edituserformitem'><h4>Edit Name</h4>" +
        "<input type='text' placeholder='new name' size=93>" +
        "<button onclick='editUserName(this);'>Edit</button></div>" +
        "<div class='edituserformitem'><h4>Edit Preferences (Choose all the ones you want to see)</h4>" +
        "<input type='checkbox' name='userPrefencesCheckbox' value='water'> Water<br/>" +
        "<input type='checkbox' name='userPrefencesCheckbox' value='electricity'> Electricity<br/>" +
        "<input type='checkbox' name='userPrefencesCheckbox' value='food waste'> Food Waste<br/>" +
        "<input type='checkbox' name='userPrefencesCheckbox' value='trash'> Trash<br/>" +
        "<input type='checkbox' name='userPrefencesCheckbox' value='car usage'> Car Usage<br/>" +
         "<button onclick='editUserPreferences(this);'>Edit</button></div>" +
        "</div>";

    return form;
}

function getFansList(type) {
    var user = "";
    if (type === "user") {
        user = getCookie().client_id
    } else {
        user = getCookie().idol_id
    }
    console.log(user); 
    var socket = io.connect("/"); 
    var data = { 
        action_type: "getFansList",
        user_id: user 
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message) {  

        message = JSON.parse(message);
        displayHTMLOverlay(createUsersList(message.fans, "Fans List"));

    });

}

function displayHTMLOverlay(htmlText) {
    $(".overlay-ecoform")[0].style.display= 'block';
    $(".overlay-ecoform").append(htmlText);

    event.preventDefault(); 
    var docHeight = $(document).height();
    var scrollTop = $(window).scrollTop();
    $('.overlay-bg').show().css({'height' : docHeight});
    $(".overlay-ecoform").show().css({'top': scrollTop+20+'px'});
}

function closeOverlay(trigger) {
    $(".overlay-ecoform").html(trigger);

    $(".overlay-ecoform")[0].style.display = "none";
    $(".overlay-bg")[0].style.display = "none";
}

function createUsersList(users, title) {
    var usersHTML = "<div id='usersList'><h3>" + title + "</h3>";
    users.forEach(function (user) {
        usersHTML += "<div class='user'><img src='images/heloisa.png' alt='"+ user.name +"' title='" + user.name + "' width='60' height='60'" + 
            " align='left' hspace='20' onclick='viewIdolProfile(\"" + user._id +"\");'/>"+
            "<a onclick='viewIdolProfile(\"" + user._id +"\");'>" +user.name+ "</a> </div>";
    });

    usersHTML += "</div>";
    console.log(usersHTML);

    return usersHTML;
}

function getIdolsList(type) {

    var user = "";
    if (type === "user") {
        user = getCookie().client_id
    } else {
        user = getCookie().idol_id
    }
    var socket = io.connect("/"); 
    var data = { 
        action_type: "getIdolsList",
        user_id: user
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message) {  

        message = JSON.parse(message);
        displayHTMLOverlay(createUsersList(message.idols, "Idols List"));

    });

    event.preventDefault(); 
    var docHeight = $(document).height();
    var scrollTop = $(window).scrollTop();
    $('.overlay-bg').show().css({'height' : docHeight});
    $(".overlay-ecoform").show().css({'top': scrollTop+20+'px'}); 
}