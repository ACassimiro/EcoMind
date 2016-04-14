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
	
	getPostList(-5, filter);
}

function getPostList(number, filter){
    var cookie = getCookie();
    var socket = io.connect("/"); 
 	filter.forEach(function(f){
 		console.log(f);
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

$("section.posting-area").hover(
	function(){

		$(".posting-input").css('opacity', '0').animate({opacity: 1}).queue(function(n) {
        	$(this).html(
	          '<h2>Type:</h2> ' +
	              '<input class="radio" type="radio" name="radio_user_post_type" value="post" onclick="createPostsHome()" checked><label>Post</label>' +
	              '<input class="radio" type="radio" name="radio_user_post_type" value="news" onclick="createNewsHome()"><label>News</label>' +
	              '<input class="radio" type="radio" name="radio_user_post_type" value="poll" onclick="createPollPostHome()"><label>Poll</label>' +
	              '<br/>' +
	          '<h2>Ecological Field: </h2><br/>' +
	              '<input class="checkbox" type="checkbox" name="home_ecological_field" value="water"/><label>Water</label>'+
	              '<input class="checkbox" type="checkbox" name="home_ecological_field" value="electricity"/><label>Electricity</label>'+
	              '<input class="checkbox"type="checkbox" name="home_ecological_field" value="food waste"/><label>Food waste</label>' +
	              '<input class="checkbox" type="checkbox" name="home_ecological_field" value="trash"/><label>Trash</label>'+
	              '<input class="checkbox" type="checkbox" name="home_ecological_field" value="car usage"/><label>Car usage</label>' +
	          '<div id="userPostArea">'+
	            '<h2>Title: </h2>'+
	            '<input class="title" id="home_user_post_title" type="text" style="width:440px" /><br/>'+
	            '<textarea id="home_user_post_body" cols="60" rows="10" placeholder="Type your text here..."></textarea>'+
	          '</div>' +
	          '<button type="button" class="btn btn-lg btn-default" onclick="submitUserPost()">Post</button>' 
        	);
        	n();
        });


	},
	function(){
		$(".posting-input").html("");
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