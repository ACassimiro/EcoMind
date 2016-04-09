function openInput(trigger) {
	$(trigger).siblings(".comment-input").html("<input type='text' placeholder='type your text here and enter...'>");
	$(trigger).attr("onclick","closeInput(this)");
	$(trigger).css("color", "#005D51");
}

function closeInput(trigger) {
	$(trigger).siblings(".comment-input").html("");
	$(trigger).attr("onclick","openInput(this)");
	$(trigger).css("color", "#717171");
}

function like(trigger) {
	var numlikes = Number($(trigger).siblings("#numlikes").html());
	$(trigger).siblings("#numlikes").html(numlikes+1);
	$(trigger).attr("onclick","unlike(this)");
	$(trigger).css("color", "#005D51");
	//TODO: Add function to add in database
}

function unlike(trigger) {
	var numlikes = Number($(trigger).siblings("#numlikes").html());
	$(trigger).siblings("#numlikes").html(numlikes-1);
	$(trigger).attr("onclick","like(this)");
	$(trigger).css("color", "#717171");
	//TODO: Add function to add in database
}