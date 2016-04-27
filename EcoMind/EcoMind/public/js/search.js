function search(){
  if(document.getElementById("searchBox").value === ""){
    return;
  }

  my_form=document.createElement('FORM');
  my_form.name='myForm';
  my_form.method='GET';
  my_form.action="searchres.html";

  my_tb=document.createElement('INPUT');
  my_tb.type='TEXT';
  my_tb.name='search';
  my_tb.value= encodeURIComponent(document.getElementById("searchBox").value);
  my_form.appendChild(my_tb);

  document.body.appendChild(my_form);
  my_form.submit();

}



function getSearchList(number, filter){
    var cookie = getCookie();
    var socket = io.connect("/"); 
    var data = { 
       action_type: "getSearchPosts",
       number: number,
       filter: filter,
       user_id: undefined
    };

    console.log("Testing search news");
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

}

function getSearchUser(number, filter){
    var cookie = getCookie();
    var socket = io.connect("/"); 
    
    var data = { 
      action_type: "getSearchUsers",
      number: number,
      filter: filter,
      user_id: undefined
    };

     console.log("Testing search users");
     socket.send(JSON.stringify(data)); 
     
    socket.on("message", function(message){
         message = JSON.parse(message);
         var htmlposts = "";
         console.log(message);
         message.users.forEach(function(user) {
            htmlposts += createSearchedUser(user);  
          });
       $(".news .users").append(htmlposts);

    });
}


function fillSearch(){
  $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        } else{
            return results[1] || 0;
        }
    } 
    var number = -5;
    var position;
    window.scrollTo(0, 10);
    window.scrollTo(0, 0);
    var query = $.urlParam('search');
    query = decodeURIComponent(decodeURIComponent(query));
    
    query = query.toLowerCase();
    // alert(query);

    getSearchUser(number, query);
    getSearchList(number, query);
              

    $(window).scroll(function() {       
        position = $("#postEnd").position();
        if (($(window).scrollTop() == ($(document).height() - $(window).height()))) {
              number = number + 5;
              getSearchUser(number, query);
              getSearchList(number, query);
        }
    });
}