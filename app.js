var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));
app.post('/sendForm', function (req, res) {
    var obj = {};
    console.log('body: ' + JSON.stringify(req.body));
    res.send(req.body);
});


app.post('/subscribe', function (req, res) {
    var userEmail = JSON.stringify(req.body.email);
    console.log('email: ' + userEmail);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'email@mail.com',
            pass: 'secret'
        }
    });
    var mailOptions = {
        from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
        to: userEmail, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ✔' // plaintext body
    };
    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, function(error, info){
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log('Message sent: ' + info.response);
    //
    // });
    res.send({});
});


app.get('/javascripts/main.js', function (req, res) {
    res.sendFile(__dirname + '/public/javascripts/main.js');
});



    app.get('/stylesheets/main.css', function (req, res) {
        res.sendFile(__dirname + '/public/stylesheets/main.css' );
    });



var navPages = [
    {url: '/', fname: 'home.html'},
    {url: '/home', fname: 'home.html'},
    {url: '/repertoire', fname: 'repertoire.html'},
    {url: '/news', fname: 'news.html'},
    {url: '/about', fname: 'about.html'},
    {url: '/booking', fname: 'booking.html'}
];

navPages.forEach(function (page) {
    app.get(page.url, function (req, res) {
        var isAjaxRequest = req.xhr;
        if (isAjaxRequest) {
            res.sendFile(__dirname + '/public/blocks/' + page.fname);
        } else {
            res.sendFile(__dirname + '/public/index.html');
        }
    });
});


app.listen(3000, function () {
    console.log("Express server listening on port %d", this.address().port);
});

module.exports = app;
