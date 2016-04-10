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
            alart("Sorry. We could not load the user. Try again.");
        }

    });
}

function fillUserProfile(user) {
	if (user.gender === "female") {
		$(".userInformation .userBox #photo").html('<img src="images/woman1.png">');
	} else {
		$(".userInformation .userBox #photo").html('<img src="images/man1.png">');
	}

    $(".userInformation .userBox #username").html(user.name);
    $(".userInformation .profileUserInfo #birthdate").html(user.birthdate);
    $(".userInformation .profileUserInfo #email").html(user.email);
    
    user.preferences.forEach(function (preference) {
    	$(".userInformation .profileUserInfo #preferences ul").append('<li class="'+formatEcoTags(preference)+'">'+preference+'</li>');
    });

    
    getUserPosts(user._id, 0);

    //getObjectivesAchievements(user._id);
    

}

function getUserPosts(id, number) {

   var socket = io.connect("/"); 
   var data = {  
       action_type: "getUserPosts",
       http_type: "GET",
       user_id: id,
       number: number
   };

   socket.send(JSON.stringify(data)); 

   socket.on("message", function(message){  

        message = JSON.parse(message);
     
        var htmlpostsleft = "";
        var htmlpostsright = "";
     	
        var count = 0;
        message.posts.forEach(function(post) {
        	count = count + 1;
        	var htmlposts = "";
    	    if(post.likes == null){
    		   likes = 0;
    	    } else {
    		   likes = post.likes;
    	    }

    	    if(post.comments == null){
     		   comments = [];
     	    } else {
     		   comments = post.comments;
     	    }

     	    htmlposts += '<div class="post" id="' + post._id +'">' +
               '<h2>' + post.title + '</h2>' +
               '<div class="tags">';

            var tagsize = 100/post.ecological_field.length;
            post.ecological_field.forEach(function(tag) {
            	htmlposts += '<div class="' + formatEcoTags(tag) + ' tag'+Math.ceil(tagsize)+'"></div>';
            });   

            htmlposts += '</div>' +
            	'<div class="content">' +
            	'<p>' + post.description + '</p></br>';

            if (post.type === "poll") {
                post.options.forEach(function(opt) {
                    htmlposts += '<input type="radio" name="radio_user_post_poll" value="' + opt +'"> ' +  opt + '</br>';
                });
                htmlposts += '</br><button onclick="pollVote(this)">Vote</button>'
               
            }
     	    
			htmlposts += '</div>'+
				'<hr>' +
				'<div class="social-media-buttons">' +
				'<button onClick="like(this);"><span class="glyphicon glyphicon-thumbs-up"></span> Like</button><div id="numlikes" class="likes">' + likes + '</div>' +
				'<button onClick="openInput(this);"><span class="glyphicon glyphicon-comment"></span> Comment</button><div id="numcomments" class="likes">' + comments.length + '</div><div class="comment-input"></div>' +
				'</div>' +
				'<hr>' +
				'<div class="comments">'; 
			
			var numcom = 0;
			comments.forEach(function(c) {
				numcom = numcom + 1;

				htmlposts += '<div class="comment">' +
						'<h5>' +numcom + '</h5>' +
						'<h4>' +c.name+'</h4>' +
						'<p>'+c.comment + '</p>' +
						'</div>';
			});

			htmlposts += "</div></div>";

			if ((count % 2) === 0) {
				htmlpostsright += htmlposts;
				
			} else {
				htmlpostsleft += htmlposts;
			}
				
    	    //submitCommentPost
        
            
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
 		
 		var htmluser = "<div onclick='viewIdolProfile(\"" + user._id +"\");'>";
 		
 		if(user.gender==="female") {
 			htmluser += '<img src="images/woman1.png">';
 		} else {
 			htmluser += '<img src="images/man1.png">';
 		}
		
		htmluser += '<h2>' + user.name +'</h2></div>';
					
		$(".overlay .userList .list").append(htmluser);	
 		
   });

   openOverlay();
}

function openEditUserInfo() {
	$(".overlay .userList h1").html("Edit User Info");
    var form = "<div id='edituserform'><div class='error'></div><div class='success'></div>" +
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

window.onload = function () {
	var chart = new CanvasJS.Chart("chartContainer", {
		title:{
			text: "User evolution",
			fontSize: 20          
		},
		height: 280,
		axisY: {
			title: "Quantity",
			suffix: " Gallons",
			labelFontSize: 14,
			titleFontSize: 20      
		},
		axisX: {
			title: "Date of update",
			labelFontSize: 14,
			titleFontSize: 20
		},
		animationEnabled: true,
		data: [              
			{
				type: "spline",
				name: "Water Waste",
				dataPoints: [
			        {label: "Jan 2016" , y: 44} ,     
			        {label:"Feb 2016", y: 37} ,     
			        {label: "Mar 2016", y: 34}
			    ]
			},
			{
				type: "spline",
				name: "Electricity Waste",
				dataPoints: [
			        {label: "Jan 2016" , y: 300} ,     
			        {label:"Feb 2016", y: 230} ,     
			        {label: "Mar 2016", y: 400}
			    ]
			},
			{
				type: "spline",
				name: "Food Waste",
				dataPoints: [
			        {label: "Jan 2016" , y: 20} ,     
			        {label:"Feb 2016", y: 37} ,     
			        {label: "Mar 2016", y: 25}
			    ]
			},
			{
				type: "spline",
				name: "Trash",
				dataPoints: [
			        {label: "Jan 2016" , y: 32} ,     
			        {label:"Feb 2016", y: 39} ,     
			        {label: "Mar 2016", y: 49}
			    ]
			}

		]
	});
	chart.render();
}

$(window).on("scroll", function() {
	$("body").toggleClass("scrolled", $(window).scrollTop() > 0);
});
