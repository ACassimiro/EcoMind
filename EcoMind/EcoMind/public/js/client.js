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

function submitUserPost() {
    var socket = io.connect("/"); 
    var ecological_field = [];
    $("input[type='checkbox'][name='home_ecological_field']:checked").each( function () {
        ecological_field.push($(this).val());
    });   
    var type = $($("input[type='radio'][name='radio_user_post_type']:checked")[0]).val();
    var user = getCookie().client_id;
    var message = {
        user: user,
        type: type,
        ecological_field: ecological_field,
        title: $("#home_user_post_title").val(),
        description: $("#home_user_post_body").val()
    };
 
    if (type === 'poll') {
      message["options"] = [];
      $("#pollPostOptions").children().each( function () {
           var e = $(this).val();
          if (e !== "") {
              message["options"].push(e); 
          }
            
        });
    }
    socket.on("message",function(response){  

        response = JSON.parse(response);
        if (response.data) {
            alert("Your post was succesfully created");
        } else {
            alert("We were not able to create your post");
        }
        $("#home_user_post_title").val('');
        $("#home_user_post_body").val('');
        $("input[type='checkbox'][name='home_ecological_field']:checked").attr('checked', false);
    });

    var data = { /*creating a Js ojbect to be sent to the server*/ 
        action_type: "createPost",
        message: message, 
        user_id: user           
   };
   
   socket.send(JSON.stringify(data)); 

}

function createNewsPostsHome() {
 var posthtml = "<b>Title: </b><input id='home_user_post_title' type='text' style='width:700px'/><br/> " +
       "<textarea id='home_user_post_body' cols='90' rows='10' placeholder='Type your text here...'></textarea>";
   $( "#userPostArea" ).html(posthtml);
}

function createPollPostHome() {
 var pollhtml = "<b>Title: </b><input id='home_user_post_title' type='text' style='width:700px' /><br/>" +
       "<textarea id='home_user_post_body' cols='90' rows='1' placeholder='Type the description of your poll here...''></textarea>" +
     "<div id='pollPostOptions'></div><div id='addNewPollPostOption'><input type='text' name='poll_option'/>" +              
     "<button type='button' onclick='addPollPostOption(this)'>add</button></div>";
 $( "#userPostArea" ).html(pollhtml);
}

function addPollPostOption(trigger) {

 var newValue = $($(trigger).siblings()[0]).val();
 $($(trigger).siblings()[0]).val("");

 $("#pollPostOptions").append("<input type='radio' name='poll_options' value='"+newValue+"'>"+newValue+"<br/>");

}

function initEcoInfoForm(registration, userID) {
    if (userID === null || userID === undefined || userID === "") {
        userID = getCookie().client_id;
        console.log("Aqui");
    } 
   var socket = io.connect("/"); 
   var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "getEcoInformationQuestions",
       http_type: "GET"
   };

   socket.send(JSON.stringify(data)); 

   socket.on("message", function(message){  

       message = JSON.parse(message);
       if (message.data) {
            displayHTMLOverlay(createEcoInformationForm(registration, message.data, userID));
       } else {
           alert("We had a problem, please reload the page.");
       }

   });
}

function showEcoFormPopUp(userID) {
   initEcoInfoForm(true, userID);
   event.preventDefault(); // disable normal link function so that it doesn't refresh the page
   var docHeight = $(document).height(); //grab the height of the page
   var scrollTop = $(window).scrollTop(); //grab the px value from the top of the page to where you're scrolling
   $('.overlay-bg').show().css({'height' : docHeight}); //display your popup background and set height to the page height
   $(".overlay-ecoform").show().css({'top': scrollTop+20+'px'}); //show the appropriate popup and set the content 20px from the window top

}


/*
[{
   question:xxx
   type: number/radio
   unit: pound
   options: ifradio
   ecological_field: 
}]

*/
function createEcoInformationForm(registration, info, userID) {
    var formHTML = "";
    if (registration) {
        formHTML += "Your account was succesfully created. Please, fill the Eco-Information Form.<br/>" +
       "<button onclick='location.href = \"login_page.html\"';>Cancel</button>";
    }

    formHTML += "<div class='error'></div><div class='success'></div><br/><form>" +
       "<div id='userID' style='display: none;'>" + userID + "</div>";


   info.forEach(function (e) {
       formHTML += e.question + " ";
       if (e.type === "number") {
           formHTML +=   "<input type='text' id='" + e.flag+ "' name='" + e.ecological_field + "' />" + e.unit+" <br/>"
       } else if (e.type === "radio") {
           formHTML += "<div id='"+ e.id_field + "'>";
           e.options.forEach(function (opt) {
               formHTML +=   "<input type='radio' id='" + e.flag+ "' name='" + e.id_field + "' value='" + opt+"'/>" + opt +" <br/>"
           });
           formHTML += "</div>";
       }
   });

   formHTML += "</form><button onclick=\"submitEcoInfoForm()\">Submit</button>";   

   return formHTML;
   

}

function submitEcoInfoForm() {
   var socket = io.connect("/"); 
   var responses = {
       question1: $("#question1").val(),
       question2: $("#question2").val(),
       question3: $($("input[type='radio'][name='recycle_trash_radio']:checked")[0]).val(),
       question4: $("#question4").val(),
       question5: $("#question5").val(),
       question6: $($("input[type='radio'][name='car_usage_radio']:checked")[0]).val(),
       question7: $("#question7").val(),
       question8: $("#question8").val(),
       question9: $("#question9").val()
   };

   socket.on("message",function(response){  

       response = JSON.parse(response);
       if (response.data) {
            $(".success").html("Your Eco-Information was succesfully saved");   
       } else {
            $(".error").html("We were not able to save your Eco-Information. Try it later");
           
       }
   });

   var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "submitEcoInfoForm",
       http_type: "POST",
       message: responses, 
       user_id: $("#userID").html()           
   };
   
   socket.send(JSON.stringify(data)); 
}

function getUserPosts(id, number) {

   var socket = io.connect("/"); 
   var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "getUserPosts",
       http_type: "GET",
       user_id: id,
       number: number
   };

   socket.send(JSON.stringify(data)); 

   socket.on("message", function(message){  

       message = JSON.parse(message);
       console.log(message);
       var htmlposts = "";
       message.posts.forEach(function(post) {
    	    if(post.likes == null){
    		   likes = 0;
    	    } else {
    		   likes = post.likes;
    	    }

    	    if(post.comments == null){
     		   comments = "No comments";
     	    } else {
     		   comments = post.comments;
     	    }
    	    
            htmlposts += '<div class="postbox" id="' + post._id +'">' +
               '<h3>' + post.title + '</h3>' +
               '<p>' + post.description + '</p>';
            if (post.type === "poll") {
                post.options.forEach(function(opt) {
                    htmlposts += '<input type="radio" name="radio_user_post_poll" value="' + opt +'"> ' +  opt + '</br>';
                });
                htmlposts += '</br><button onclick="pollVote(this)">Vote</button></br></br></br>'
               
            }

            htmlposts += '<br>' + 
            '<b> Number of likes: </b>' + 
            '<p id="likeNum">' + likes +'</p>' +
            '<hr class="featurette-divider">' +
            '<button type="button" onclick="like()" id="like" class="btn btn-lg btn-default ' + post._id +'""data-toggle="button" aria-pressed="false" autocomplete="off">Like</button>' +
            '<button type="button" onclick="showComment()" id="comment" class="btn btn-lg btn-default ' + post._id +'"" data-toggle="button" aria-pressed="false" autocomplete="off">Comment</button>' +
            '<hr class="featurette-divider">' + 
            '<div id="userCommentArea" style="display: none" class="' + event.target.id +'" >' +
            '<form>' +
            '<textarea id="comment_body" cols="100" rows="4" placeholder="Type your text here..."></textarea>'+
            '<button type="button" class="btn btn-lg btn-default" id="postComment" onclick="submitCommentPost()">Post it</button>' +
            '</form>' +
            '<p>' + comments + '</p>' +            
            '</div>' + 
            '</div>' ;
       
            
        });
        $("#postsArea").append(htmlposts);
   });
}

function pollVote(trigger) {
    console.log("Not implemented yet");
}

function getPostList(number, filter){
 var cookie = getCookie();
 var socket = io.connect("/"); 
 
 //alert("Inside the function");
 
   var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "getPostList",
       http_type: "GET",
       number: number,
       filter: filter,
       user_id: undefined
   };

   socket.send(JSON.stringify(data)); 
   
   socket.on("message", 
      function(message){
          message = JSON.parse(message);
          var htmlposts = "";

          console.log("Server side message:");
          console.log(message);
 
          message.posts.forEach(function(post){
      	    if(post.likes == null){
      		    likes = 0;
      	    } else {
      		    likes = post.likes;
      	    }
    	   
      	    if(post.comments == null){
       		    comments = "No comments";
       	    } else {
       		    comments = post.comments;
       	    }
      	   
            console.log("recebi");

            htmlposts += '<div class="postbox" id="' + post._id +'">' +
                         '<h3>' + post.title + '</h3>' +
                         '<p>' + post.description + '</p>'  
            if (post.url !== null && post.url !== undefined) {
              htmlposts += "<a href='" + post.url + "' target='_blank'> Read more...</a>";
            }

            if (post.type === "poll") {
              post.options.forEach(function(opt) {
                htmlposts += '<input type="radio" name="radio_user_post_poll" value="' + opt +'"> ' +  opt + '</br>';
              });
              htmlposts += '</br><button onclick="pollVote(this)">Vote</button></br></br></br>'          
            }
                alert(JSON.stringify(comments));
                // alert(message.user);

            htmlposts += '<br>' + 
                        '<b> Number of likes: </b>' + 
                        '<p id="likeNum">' + likes +'</p>' +
                        '<hr class="featurette-divider">' +
                        '<button type="button" onclick="like()" id="like" class="btn btn-lg btn-default ' + post._id +'""data-toggle="button" aria-pressed="false" autocomplete="off">Like</button>' +
                        '<button type="button" onclick="showComment()" id="comment" class="btn btn-lg btn-default ' + post._id +'"" data-toggle="button" aria-pressed="false" autocomplete="off">Comment</button>' +
                        '<hr class="featurette-divider">' + 
                        '<div id="userCommentArea" style="display: none" class="' + event.target.id +'" >' +
                        '<form>' +
                        '<textarea id="comment_body" cols="100" rows="4" placeholder="Type your text here..."></textarea>'+
                        '<button type="button" class="btn btn-lg btn-default" id="postComment" onclick="submitCommentPost()">Post it</button>' +
                        '</form>';

            var i = 0;
            for(i = 0; i < comments.length; i++){
              htmlposts += '<p><b>' + comments[i].name + '</b>:' + comments[i].comment  + '</p><br>';           
            }
            
            htmlposts += '</div>' + 
            '</div>' ;
      });
      $("#postContainer").append(htmlposts);
   
   });
}

function sendEmail() {
   var socket = io.connect("/"); 
   var data = { /*creating a Js ojbect to be sent to the server*/ 
       action_type: "sendEmail",
       message: {
           name: $("#nameContact").val(),
           email: $("#emailContact").val(),
           msg: $("#messageContact").val()
       }, 
       user_id: getCookie().client_id 
   };

   socket.send(JSON.stringify(data)); 

   socket.on("message", function(message){  

       message = JSON.parse(message);
       // Do the return of sendEmail

   });

}

function displayHTMLOverlay(htmlText) {
   $(".overlay-ecoform")[0].style.display= 'block';
   $(".overlay-ecoform").append(htmlText);

   event.preventDefault(); 
   var docHeight = $(document).height();
   var scrollTop = $(window).scrollTop();
   $('.overlay-bg').show().css({'height' : docHeight});
   $(".overlay-ecoform").show().css({'top': scrollTop+20+'px'});
}

function closeOverlay(trigger) {
   $(".overlay-ecoform").html(trigger);

   $(".overlay-ecoform")[0].style.display = "none";
   $(".overlay-bg")[0].style.display = "none";
}

function createUsersList(users, title) {
   var usersHTML = "<div id='usersList'><h3>" + title + "</h3>";
   users.forEach(function (user) {
       usersHTML += "<div class='user'><img src='images/heloisa.png' alt='"+ user.name +"' title='" + user.name + "' width='60' height='60'" + 
           " align='left' hspace='20' onclick='viewIdolProfile(\"" + user._id +"\");'/>"+
           "<a onclick='viewIdolProfile(\"" + user._id +"\");'>" +user.name+ "</a> </div>";
   });

   usersHTML += "</div>";
   console.log(usersHTML);

   return usersHTML;
}

function openUserPostBlock() {
    var html = '<form>' +
          '<b>Type:</b> ' +
              '<input type="radio" name="radio_user_post_type" value="post" onclick="createNewsPostsHome()" checked> Post ' +
              '<input type="radio" name="radio_user_post_type" value="news" onclick="createNewsPostsHome()"> News ' +
              '<input type="radio" name="radio_user_post_type" value="poll" onclick="createPollPostHome()"> Poll ' +
              '<br/>' +
          '<b>Ecological Field: </b>' +
              '<input type="checkbox" name="home_ecological_field" value="water"/>Water'+
              '<input type="checkbox" name="home_ecological_field" value="electricity"/>Electricity'+
              '<input type="checkbox" name="home_ecological_field" value="food waste"/>Food waste' +
              '<input type="checkbox" name="home_ecological_field" value="trash"/>Trash'+
              '<input type="checkbox" name="home_ecological_field" value="car usage"/>Car usage' +
          '<div id="userPostArea">'+
            '<b>Title: </b><input id="home_user_post_title" type="text" style="width:700px" /><br/>'+
            '<textarea id="home_user_post_body" cols="90" rows="10" placeholder="Type your text here..."></textarea>'+
          '</div>' +
          '<button type="button" class="btn btn-lg btn-default" onclick="submitUserPost()">Post it</button>' +
        '</form>';

        $("#formplace").html(html);
        $("#openPostArea").attr('onclick', 'closeUserPostBlock()')
}


function closeUserPostBlock() {
    $("#formplace").html("");
    $("#openPostArea").attr('onclick', 'openUserPostBlock()')
}