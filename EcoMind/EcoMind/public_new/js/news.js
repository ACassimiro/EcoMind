function newsSelected(){

	//alert(event.target.id);
	$(".block").remove(); 
	// var clicked = event.target.id;
	// var filter = {clicked};

	var filter = [];

	if(event.target.id == "misc"){
		filter.push({});
	} else {
		filter.push({"ecological_field": event.target.id});

	}

	getNewsList(-5, filter);
	loadOnScroll(filter);
}

function loadOnScroll(filter) {
	var number = 0;
    $(window).scroll(function() {  
		if (($(window).scrollTop() == ($(document).height() - $(window).height()))) {

            getNewsList(number, filter);
            number = number + 5;
    	}
        	
        	
    });  
}
