$("a[href^='community.html#']").on("click", function (e) { 
	e.preventDefault();
	var clicked = e.target;
	var target = $(clicked).attr("href");
	target = "#"+target.split("#")[1];
	var destination = $(target);
	var top = destination.position().top;
	$("html, body").animate({scrollTop: top -50});
});