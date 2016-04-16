var express=require('express');
var nodemailer = require("nodemailer");
var app=express();

function sendEmail(socket, req){

	var transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "ecomindsu",
				pass: "SumatranTiger"
			}
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: "ecomindsu@gmail.com", // sender address
		to: "ecomindsu@gmail.com", // list of receivers
		subject: 'user @' + req.user_id + ' - ' + req.message.title, // Subject line
		text: req.message.msg, // plaintext body
		html: req.message.msg
	};

	transporter.sendMail(mailOptions, function(error, response){
		if (error){
			console.log(error);
		} else{
			console.log("Message sent from @" + req.user_id);
		}
	
	});
}

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'sendEmail':
            sendEmail(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;