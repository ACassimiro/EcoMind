var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.get('/send', function(req,res){
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'ecomindsu',
			pass: 'SumantranTiger'
		}
	});
	transporter.sendMail({
		from: user,
		to: 'speerbetsy@gmail.com',
		subject: 'Node.js test',
		html: '<div style="text-align:center;background:dodgerblue;color:white">My email form</div>'
		
	});
	res.redirect('/');
});
app.listen(process.env.PORT|| 3000);