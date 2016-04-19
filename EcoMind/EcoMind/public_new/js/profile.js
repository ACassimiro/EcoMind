function openRedoEcoForm() {
    var id = getCookie().client_id;
    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "getEcoInformationQuestions",
        http_type: "GET"
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){ 
        message = JSON.parse(message);
        var formhtml = createEcoInformationForm(message.data, id);
        $("#tab3").html(formhtml);
        $("#tab3").append("<button onClick='submitEcoInfoForm()'>Submit</button>")
    });
}


function profileScroll(userId){
    var number = 5;
    $(window).scroll(function() {  
        if (($(window).scrollTop() == ($(document).height() - $(window).height()))) {
            getUserPosts(userId, number);
            number = number + 5;
        }      
    });  
}


function createUserProfile() {
    var userId = getCookie().client_id;

    var socket = io.connect("/"); 
    
    var data = { 
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
            alert("Sorry. We could not load the user. Try again.");
            return;
        }

        $(window).scroll(function() { 
            console.log(userId);   
        });    
    });
}

function fillUserProfile(user) {
    
    if(user.image === null || user.image === undefined){
        if (user.gender === "female") {
            $(".userInformation .userBox #photo").html('<img src="images/woman1.png" id="userImg">');
        } else {
            $(".userInformation .userBox #photo").html('<img src="images/man1.png" id="userImg">');
        }
    } else {
        $(".userInformation .userBox #photo").html('<img src="'+ user.image +'" id="userImg">');
    }

    $(".userInformation .userBox #username").html(user.name);
    $(".userInformation .profileUserInfo #birthdate").html(user.birthdate);
    $(".userInformation .profileUserInfo #email").html(user.email);
    
    user.preferences.forEach(function (preference) {
    	$(".userInformation .profileUserInfo #preferences ul").append('<li class="'+formatEcoTags(preference)+'">'+preference+'</li>');
    });

    
    getUserPosts(user._id, 0);

    loadChart(user._id);

    profileScroll(user._id);
}

function viewIdolProfile(id) {
    if(id === getCookie().client_id){
        console.log("Clicking on yourself");
        return;
    }
    document.cookie=("idol_id=").concat(id);
    location.href = "profile_idol.html";
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
        
        if (message.user !== null && message.user !== undefined) {
            checkIdol();
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

function getUserPosts(id, number) {
    
    var socket = io.connect("/"); 
   
    var data = {  
        action_type: "getUserPosts",
        user_id: id,
        number: number
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  
        
        message = JSON.parse(message);
     
        var htmlpostsleft = "";
        var htmlpostsright = "";
     	
        var count = 0;
        message.posts.forEach(function(p) {
        	count = count + 1;
        	var htmlposts = createPost(id, p);
			if ((count % 2) === 0) {
				htmlpostsright += htmlposts;
				
			} else {
				htmlpostsleft += htmlposts;
			}
                    
        });

        $(".posts .column1").append(htmlpostsleft);
        $(".posts .column2").append(htmlpostsright);
    });
}

function closeProfileOverlay() {
	$(".overlay .userList .list").html("");
	$(".overlay .userList .edituser").html("");
	$(".overlay").css("visibility", "hidden");
}

function getFansList(type) {
    var user = "";
    if (type === "user") {
        user = getCookie().client_id
    } else {
        user = getCookie().idol_id
    }
    
    var socket = io.connect("/"); 
    
    var data = { 
        action_type: "getFansList",
        user_id: user 
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message) {  

        message = JSON.parse(message);

        $(".overlay .userList h1").html("Fans List");
        createUsersList(message.fans);

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

        $(".overlay .userList h1").html("Idols List");
        createUsersList(message.idols);

    });

}

function createUsersList(users) {
	$(".overlay .userList .list").html("");
   	users.forEach(function (user) {
 		
 		var htmluser = "<div onclick='viewIdolProfile(\"" + user._id +"\");'><img src='" + user.image + "'>";
 		
		
		htmluser += '<h2>' + user.name +'</h2></div>';
					
		$(".overlay .userList .list").append(htmluser);	
 		
   });

   openOverlay();
}

function openEditUserInfo() {
	$(".overlay .userList h1").html("Edit User Info");
    var form = "<div id='edituserform'><div class='error'></div><div class='success'></div>" +
        "<div class='edituserformitem'><h4>Edit Image</h4>" +
        "<img src='"+ document.getElementById("userImg").src + "' height='200' width = '150' id='imagePreview' alt='Image preview...'>" +
        "<input type='file' id='imageInput' onchange='previewFile()' accept='.png, .jpeg, .jpg, .bmp, .gif'>" + 
        "<button onclick='editImage(this);'>Edit</button>" + 
        "</div>" +
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
       $(".overlay .userList .edituser").html(form);
       openOverlay();
}

function editImage(trigger){
    var socket = io.connect("/");

    //alert(document.getElementById("imagePreview").src);

    var newData = {
        action_type: "editUserImage",
        message: {
            image: document.getElementById("imagePreview").src
        }, 
        user_id: getCookie().client_id
    };
    socket.send(JSON.stringify(newData));

    socket.on("message",function(message){  
        message = JSON.parse(message);
        if (message.update === true) {
            $(".success").html("* Image successfully updated.");
            document.getElementById("userImg").src = document.getElementById("imagePreview").src;
            $(".error").html("");
            // $(siblings[0]).val('');
            $(".userInformation .userBox #username").html(username);
        } else if (message.update === false){
            $(".error").html("* We were not able to edit your image, try again.");
        }
    });
    
}

function previewFile(){
        
    var x = document.getElementById("imageInput");
    var txt = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            return;
        } else {
            for (var i = 0; i < x.files.length; i++) {
                var file = x.files[i];
                if ('size' in file) {
                    // console.log("File size:", file.size);
                    // SIZE LIMIT 2MB (Average of cellphone photo size)
                    if(file.size > 2000000) {
                        alert("Sorry, try again with a another image smaller than 1mb.");
                        return;
                    }
                }
            }
        }
    } 



    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0]; 
    var reader = new FileReader();


    reader.onloadend = function () {
        preview.src = reader.result;
        // console.log("Source:", preview.src);
        // console.log(preview.src.length);
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}


function editPassword(trigger) {
    $(".success").html("");
    $(".error").html("");
    var socket = io.connect("/");

    var siblings = $(trigger).siblings('input');
    var oldpass = $(siblings[0]).val();
    var newpass = $(siblings[1]).val();
    var rnewpass = $(siblings[2]).val();
    
    if (newpass === "") {
        $(".error").append("* there is no new password.");
    } else if (newpass !== rnewpass) {
        $(".error").append("* the password and the repeat does not match.");
    } else {
        var email = $(".userInformation .profileUserInfo #email").html();
        var data = { 
            action_type: "login",
            message: {
                email: email,
                password: oldpass
            }, 
            user_id: getCookie().client_id
                    
        };
        
        socket.send(JSON.stringify(data)); 

        socket.on("message",function(message){  
            message = JSON.parse(message);
            if (message.data === true) {
                var newData = {
                    action_type: "editPassword",
                    message: {
                        password: newpass
                    }, 
                    user_id: getCookie().client_id
                };
                socket.send(JSON.stringify(newData));

                socket.on("message",function(message){  

                    message = JSON.parse(message);
                    if (message.update === true) {
                        $(".success").html("* Password successfully updated.");
                        $(".error").html("");
                        $(siblings[0]).val('');
                        $(siblings[1]).val('');
                        $(siblings[2]).val('');

                    } else if (message.update === false){
                        $(".error").html("* We were not able to edit your password, try again.");
                    }
                });

            } else if (message.data === false){
                $(".error").append("* the old password does not match with your actual password.");
            }

        });
    }
   
}

function editUserName(trigger) {
    var socket = io.connect("/");
    var siblings = $(trigger).siblings('input');
    var username = $(siblings[0]).val();

    var newData = {
        action_type: "editUserName",
        message: {
            name: username
        }, 
        user_id: getCookie().client_id
    };
    socket.send(JSON.stringify(newData));

    socket.on("message",function(message){  

        message = JSON.parse(message);
        if (message.update === true) {
            $(".success").html("* Username successfully updated.");
            $(".error").html("");
            $(siblings[0]).val('');
            $(".userInformation .userBox #username").html(username);
        } else if (message.update === false){
            $(".error").html("* We were not able to edit your password, try again.");
        }
    });
}

function editUserPreferences(trigger) {
    var socket = io.connect("/");
    var preferences = [];
    var htmlPreferences="";
    $("input[type='checkbox'][name='userPrefencesCheckbox']:checked").each (function () {
        var e = $(this).val()
        preferences.push(e);
        htmlPreferences += '<li class="'+formatEcoTags(e)+'">'+e+'</li>';
    });  
    
    var newData = {
        action_type: "editUserPreferences",
        message: {
            preferences: preferences
        }, 
        user_id: getCookie().client_id
    };
    socket.send(JSON.stringify(newData));

    socket.on("message",function(message){  

        message = JSON.parse(message);
        if (message.update === true) {
            $(".success").html("* Preferences successfully updated.");
            $(".error").html("");
            $("input[type='checkbox'][name='userPrefencesCheckbox']:checked").attr('checked', false);
            $(".userInformation .profileUserInfo #preferences ul").html(htmlPreferences);
        } else if (message.update === false){
            $(".error").html("* We were not able to edit your password, try again.");
        }
    });
}

function loadChart(id) {
    if (id === null || id === undefined) {
        id = getCookie().client_id;
    }
    
    var socket = io.connect("/");
    var newData = {
        action_type: "processProgress",
        user_id: id
    };
    socket.send(JSON.stringify(newData));

     socket.on("message", function(message){  
        message = JSON.parse(message);
        
        if (message.progress !== null) {
            var data = [];
            for (var p in message.progress) {
                var a = {
                    showInLegend: true, 
                    type: "spline",
                    name: p,
                    legendText: p,
                    dataPoints: []
                };

                message.progress[p].forEach(function(line) {
                    a.dataPoints.push({label: line.date , y: line.progress});
                });
                

                data.push(a);
            }

            var chart = new CanvasJS.Chart("chartContainer", {
                title:{
                    text: "User evolution",
                    fontSize: 20          
                },
                height: 280,
                axisY: {
                    title: "Percentage",
                    suffix: "%",
                    labelFontSize: 14,
                    titleFontSize: 12      
                },
                axisX: {
                    title: "Date of update",
                    labelFontSize: 14,
                    titleFontSize: 20
                },
                animationEnabled: true,
                data: data
            });
            chart.render();
            loadObjectivesAchievements(id, message.progress);
        }

    });
}

function loadObjectivesAchievements(id, progress) {
    if (id === null || id === undefined) {
        id = getCookie().client_id;
    }
    
    var socket = io.connect("/");
    var newData = {
        action_type: "getObjectivesAchievements",
        user_id: id,
        progress: progress
    };
    socket.send(JSON.stringify(newData));

    socket.on("message", function(message){  
        message = JSON.parse(message);
        var htmlachie = "";
    
        if (message.achievements !== null) {
            message.achievements.forEach(function(a) {
                htmlachie += "<li>";
                if (a.obj === 'positive') {
                    htmlachie += '<span class="glyphicon glyphicon-ok-circle positive"></span>';
                } else {
                    htmlachie += '<span class="glyphicon glyphicon-remove-circle negative"></span>';
                }
                htmlachie += a.title + '</li>';
            });
            $("#tab2 ul").html(htmlachie);
        }
    });
}


jQuery(document).ready(function() {
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
 
        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });
});

$(window).on("scroll", function() {
	$("body").toggleClass("scrolled", $(window).scrollTop() > 0);
});

