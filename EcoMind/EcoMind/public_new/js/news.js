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
    	// $("html").attr("height", "10dp");
    	// $("body").attr("height", "10dp");
		//alert($('body').height() + " : " + $(window).height() + " : " + $(window).scrollTop());
    	
		if (($(window).scrollTop() == ($(document).height() - $(window).height()))) {
    		//alert(number);
    		//alert('Bottom reached!');
            getNewsList(number, filter);
            number = number + 5;
    	}
        	
        	
    });  
}

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
