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

    getUserPosts(user._id, 0);


}

function openEditUserInfo() {
    displayHTMLOverlay(createEditUserInfo());
}

function createEditUserInfo(title) {
    var form = "<div id='edituserform'><h3>Edit User Info</h3><div class='error'></div>" +
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

function editPassword(trigger) {
    var socket = io.connect("/");

    var siblings = $(trigger).siblings('input');
    var oldpass = $(siblings[0]).val();;
    var newpass = $(siblings[1]).val();
    var rnewpass = $(siblings[2]).val();
    
    if (newpass === "") {
        $(".error").append("* there is no new password.");
    } else if (newpass !== rnewpass) {
        $(".error").append("* the password and the repeat does not match.");
    } else {

    }
   
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