//Load the module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Define the express configuration
module.exports = function() {

    //Create a new express instance
    var app = express();

    //configure body parser
    app.set('json spaces',4);

    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //add access control response
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use('./public/js', express.static(__dirname + '/js'));
    // app.use('/css', express.static(__dirname + '/css'));
    app.use('./public/views', express.static(__dirname + '/views'));




    app.get('/', function(req, res){
        console.log('main entrance');
        res.sendFile('index.html', { root: "./public" });
    });

    // Load the routing files
    // require('../app/routes/users.routes.js')(app);

    //Return the Express application instance
    return app;
};