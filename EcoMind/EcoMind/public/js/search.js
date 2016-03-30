function getUserList(number, filter){
   var cookie = getCookie();
   var socket = io.connect("/"); 
 
   var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "getUserList",
       http_type: "GET",
       number: number,
       filter: filter
   };

   socket.send(JSON.stringify(data)); 
   // alert("message sent");

   socket.on("message", function(message){
         message = JSON.parse(message);
         var htmlposts = "";
         console.log(message);
         message.users.forEach(function(user) {
         	//style="display:inline; margin-right:5px; margin-left: 5px; width: 500px; heigh: 5000px">
       htmlposts += '<div class="postbox" id="' + user.name +'" ' +
               '<h3>' + user.name + '</h3>' +
               '<br>' +
               '<h3>' + user._id + '</h3>' +
               '<br>' +
               '<button type="button" class="btn btn-lg btn-default" id="' + user._id + '" onclick="accessUserProfile()">Check Profile</button>'	 +
                '</div>';  
       });
       $("#userContainer").append(htmlposts);

   });

   //("' + user._id + '")
  
}

function accessUserProfile(){
	var id = $(event.target).attr('id');
	document.cookie=("idol_id=").concat(id);
    location.href = "profile_page_idol.html";
}