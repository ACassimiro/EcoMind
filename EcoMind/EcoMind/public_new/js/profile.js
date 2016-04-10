function createUserProfile() {
	console.log("dasdsadasdas");
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

    
         

    /*if (user._id === getCookie().client_id) {
        image += '<figcaption><img src="images/config.png" width="10" height="10" onclick=' +
                                '"openEditUserInfo();" /><a onclick="openEditUserInfo();">edit</a></figcaption></figure>';
    } */

    
    var userPreferences = "<ul>";
    user.preferences.forEach(function (preference) {
    	$(".userInformation .profileUserInfo #preferences ul").append('<li class="'+formatEcoTags(preference)+'">'+preference+'</li>');
    });

    
    //getUserPosts(user._id, 0);

    //getObjectivesAchievements(user._id);
    

}

function closeOverlay() {
	$(".overlay").css("visibility", "hidden");
}

function openOverlay() {
	$(".overlay").css("visibility", "visible");
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
