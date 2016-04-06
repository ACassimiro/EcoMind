console.log("SADSADS");

$("section.posting-area").hover(
	function(){

		$(".posting-input").delay(100).queue(function(n) {
        	$(this).html('<form>' +
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
        '</form>');
        	n();
        });


	},
	function(){
		$(".posting-input").html("");
	}
);