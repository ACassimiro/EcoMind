$(".comment-input").keyup(function (e) {
    if (e.keyCode === 13) {
       // Update number of comments and add comment on list
       $(".comment-input input").val("");
      
    }
});