function loadhome() {
	setPreferences(function(p) {
		loadPosts(p);
	});
}

function setPreferences(callback) {
	var userId = getCookie().client_id;

    var socket = io.connect("/"); 
    var preferences = [];
    var data = { 
        action_type: "getUserInfo",
        http_type: "GET",
        user_id: userId
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message){  

        message = JSON.parse(message);
        if (message.user !== null && message.user !== undefined) {
        	var htmlpref = "";
        	message.user.preferences.forEach(function(p) {
        		htmlpref += '<h2 class="'+ formatEcoTags(p) +'">'+p+'<span class="glyphicon glyphicon-tag"></span></h2>';
        		preferences.push(p);
        	});
           
           $('.preferences .user-preferences').html(htmlpref);
           callback(preferences);
        } 

    });
}

function loadPosts(preferences) {
	
	var filter = [];
	preferences.forEach(function(p) {
		filter.push({"ecological_field": {"$in": [p]}});
	});
	
	getNewsList(-5, filter);
	getPostList(0, filter);
}

function getNewsList(number, filter){
    var cookie = getCookie();
    var socket = io.connect("/"); 
 	filter.forEach(function(f){
 		var data = { 
	       action_type: "getPostList",
	       number: number,
	       filter: f,
	       user_id: undefined
	   };

	   socket.send(JSON.stringify(data)); 
	   
	   socket.on("message", function(message) {
	          
	        message = JSON.parse(message);
	        var htmlposts = "";
	        if (message.posts !== null && message.posts !== undefined) {
	        	message.posts.forEach(function(post) {
	        		htmlposts += createPost(getCookie().client_id, post);
	        	});
	        	$(".news .list").append(htmlposts);
	        }
	       
	   });
 	});
   
}

function getPostList(number){
    var cookie = getCookie();
    var socket = io.connect("/");
    var socket2 = io.connect("/"); 
 	
	var data = { 
	   action_type: "getIdolsIds",
	   user_id: getCookie().client_id
	};
	
	socket.send(JSON.stringify(data)); 

   	socket.on("message", function(message) {
          
        message = JSON.parse(message);
        
        if (message.idols) {
        	$(".posts .list").html();
		    message.idols.forEach(function(idol) {
		
		    	var data2 = { 
			       action_type: "getUserPosts",
			       number: number,
			       user_id: idol.idol
			    };
		    
			    console.log(idol.idol);
			    socket2.send(JSON.stringify(data2)); 

	   			socket2.on("message", function(message2) {

	   				message2 = JSON.parse(message2);
	   				console.log(message2);
				    var htmlposts = "";
			        if (message2.posts !== null && message2.posts !== undefined) {
			        	message2.posts.forEach(function(post) {
			        		htmlposts += createPost(getCookie().client_id, post);
			        	});
			        	$(".posts .list").append(htmlposts);
			        }
	        	});
	        });
	   	} else {
	   		$(".posts .list").html("No Posts from idols");
	   	}
 	});
   
}

$("section.posting-area").hover(
	function(){

		$(".posting-input").css('opacity', '0').animate({opacity: 1}).queue(function(n) {
        	
        	n();
        });


	}
);

function createPostsHome() {
 var posthtml = '<h2>Title: </h2>'+
	            '<input class="title" id="home_user_post_title" type="text" style="width:440px" /><br/>'+
	            '<textarea id="home_user_post_body" cols="60" rows="10" placeholder="Type your text here..."></textarea>';
   $( "#userPostArea" ).html(posthtml);
}

function createNewsHome() {
 var posthtml = '<h2>Title: </h2>'+
	            '<input class="title" id="home_user_post_title" type="text" style="width:440px" /><br/>'+
	            '<h2>URL: </h2>'+
	            '<input class="title" id="home_user_url" type="text" style="width:440px" /><br/>'+
	            '<textarea id="home_user_post_body" cols="60" rows="8" placeholder="Type your text here..."></textarea>';
   $( "#userPostArea" ).html(posthtml);
}

function createPollPostHome() {
 var pollhtml = "<h2>Title: </h2>" +
 	"<input id='home_user_post_title' type='text' style='width:440px' /><br/>" +
    "<textarea id='home_user_post_body' cols='60' rows='1' placeholder='Type the description of your poll here...''></textarea>" +
    "<div id='pollPostOptions'></div><div id='addNewPollPostOption'><input type='text' name='poll_option'/>" +              
    "<button class='addbutton' type='button' onclick='addPollPostOption(this)'>add</button></div>";
 $( "#userPostArea" ).html(pollhtml);
}

function addPollPostOption(trigger) {

 var newValue = $($(trigger).siblings()[0]).val();
 $($(trigger).siblings()[0]).val("");

 $("#pollPostOptions").append("<input class='radio' type='radio' name='poll_options' value='"+newValue+"'><label>"+newValue+"</label><br/>");

}