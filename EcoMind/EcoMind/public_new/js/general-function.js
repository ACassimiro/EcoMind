function closeOverlay() {
	$(".overlay").css("visibility", "hidden");
}

function openOverlay() {
	$(".overlay").css("visibility", "visible");
}

function openInput(trigger) {
	$(trigger).siblings(".comment-input").html("<input type='text' placeholder='type your text here and enter...'>");
	$(trigger).attr("onclick","closeInput(this)");
	$(trigger).css("color", "#005D51");
}

function closeInput(trigger) {
	$(trigger).siblings(".comment-input").html("");
	$(trigger).attr("onclick","openInput(this)");
	$(trigger).css("color", "#717171");
}

function like(trigger) {
	var numlikes = Number($(trigger).siblings("#numlikes").html());
	
    var socket = io.connect("/"); 

    var id = $(trigger).parent().parent().attr("id")
    
    var data = { 
        action_type: "likePost",
        http_type: "GET",
        post_id: id,
        user_id: getCookie().client_id
    };

    socket.send(JSON.stringify(data)); 

    socket.on("message", function(message) {  

        message = JSON.parse(message);
        if (message.data) {
            $(trigger).siblings("#numlikes").html(numlikes+1);
            $(trigger).attr("onclick","dislike(this)");
            $(trigger).css("color", "#005D51");
        }

    });

    
	//TODO: Add function to add in database
}

function dislike(trigger) {
	var numlikes = Number($(trigger).siblings("#numlikes").html());
	$(trigger).siblings("#numlikes").html(numlikes-1);
	$(trigger).attr("onclick","like(this)");
	$(trigger).css("color", "#717171");
	//TODO: Add function to add in database
}

function logout() {
	document.cookie = "client_id=;";
	location.href = "index.html";
}

function getCookie() {
     var obj = {};
     var str = document.cookie;
         str = str.split(';');
     for (var i = 0; i < str.length; i++) {
         var tmp = str[i].split('=');
         obj[tmp[0].replace(/ /g,'')] = tmp[1];
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
                newCookie += ";"
             }
            newCookie += k + "=" + obj[k];
            count++;
        }
        
    });
 
    document.cookie = newCookie;
}

function formatEcoTags(tag) {
	return tag.split(' ').join('-');
}