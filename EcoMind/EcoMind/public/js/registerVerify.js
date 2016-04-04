function validateEmail() {
    var x = document.getElementById("reg_email").value;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
		var error = "Not a valid e-mail address";
        errorMessage(error);
    }
	else {
		passwordFunction();
	}
}


function nameFunction() {
	var name, l;

	name = document.getElementById("reg_name").value;
	l = name.length;
	// If the length of the name is too long
	if (l > 25) {
		var error = "Name too long";
        errorMessage(error);
	} else if (l<1){
		var error = "Name too short";
        errorMessage(error);
	} 
	else {
		dobFunction();
	}
	document.getElementById("notice").innerHTML = text;
}

function passwordFunction() {
	var pass, l, repPass, n;

	pass = document.getElementById("reg_password").value;
	repPass = document.getElementById("reg_rep_password").value;
	n = pass.localeCompare(repPass);
	
	if (n != 0){
		var error = "Password inputs do not match";
        errorMessage(error);
	}
	else{
		l = pass.length;
		// If the length of the password is too long
		if (l > 25) {
			var error = "Password is too long, must be less than 25 characters";
			errorMessage(error);
		} else if (l<8){ //password too short
			var error = "Password is too short, must be at least 8 characters";
			errorMessage(error);
		}
		else{
			nameFunction();
		}		
	}
	//document.getElementById("notice").innerHTML = text;
}

function dobFunction() {
	var dob;
	dob = document.getElementById("reg_dob").value;
	if (dob){
		prefFunction();
	}
	else {	
		var error = "Enter date of birth";
		errorMessage(error);
	}
}

function prefFunction() {
	var c1, c2, c3, c4, c5;
	c1 = document.getElementById("c1");
	c2 = document.getElementById("c2");
	c3 = document.getElementById("c3");
	c4 = document.getElementById("c4");
	c5 = document.getElementById("c5");
	
	if (c1.checked || c2.checked || c3.checked || c4.checked || c5.checked){
		return true;
		//registerUser();
	}
	else {
		var error = "You must check at least one preference";
		errorMessage(error);
	}
}

function errorMessage(er){
	alert(er);
	
}