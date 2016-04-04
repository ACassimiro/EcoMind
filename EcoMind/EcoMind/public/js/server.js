var nodemailer = require('nodemailer');

var router = express.Router();
app.use('/community_page.html', router);
router.post('/', handleSayHello); // handle the route at yourdomain.com/sayHello

function handleSayHello(req, res) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ecomindsu@gmail.com', // Your email id
            pass: 'SumatranTiger' // Your password
        }
    });
    ...
    ...
    ...
}

var text = 'Hello world from \n\n' + req.body.name;

var mailOptions = {
	from:'example@gmail.com>',
	to:'receiver@destination.com',
	subject:'Email example',
	text: text
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
});