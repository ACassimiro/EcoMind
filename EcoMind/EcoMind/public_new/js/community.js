$("a[href^='community.html#']").on("click", function (e) { 
	e.preventDefault();
	var clicked = e.target;
	var target = $(clicked).attr("href");
	target = "#"+target.split("#")[1];
	var destination = $(target);
	var top = destination.position().top;
	$("html, body").animate({scrollTop: top -50});
});

function sendEmail() {
    var socket = io.connect("/"); 
    var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "sendEmail",
       message: {
       		title: $("#emailtitle").val(),
           	msg: $("#emailmessage").val()
       }, 
       user_id: getCookie().client_id 
    };

   	socket.send(JSON.stringify(data)); 
	$("#emailtitle").val("");
    $("#emailmessage").val("");
  
}