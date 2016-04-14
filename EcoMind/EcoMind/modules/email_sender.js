var express=require('express');
var nodemailer = require("nodemailer");
var app=express();

function sendEmail(socket, req){
	var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'ecomindsu',
				pass: 'SumatranTiger'
			}
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: 'ecomindsu@gmail.com', // sender address
		to: 'speerbetsy@gmail.com', // list of receivers
		subject: 'Hello ', // Subject line
		text: 'Hello world', // plaintext body
		html: '<b>Hello world </b>' 
	};

	transporter.sendMail(mailOptions, function(error, response){
		if (error){
			console.log(error);
		} else{
			console.log("Message sent");
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