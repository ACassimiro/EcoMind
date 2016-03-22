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
   alert("message sent");

   socket.on("message", function(message){
         message = JSON.parse(message);
         var htmlposts = "";
         console.log(message);
         message.users.forEach(function(user) {
         alert("Message received");
       htmlposts += '<div class="postbox" id="' + user.name +'">' +
               '<h3>' + user.name + '</h3>' +
                '</div>';  
       });
       $("#userContainer").append(htmlposts);

   });
}