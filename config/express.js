//Load the module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//Define the express configuration
module.exports = function() {

    //Create a new express instance
    var app = express();

    //configure body parser
    app.set('json spaces',4);

    app.set('superSecret', "ilovescotchyscotch");

    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //add access control response
    app.use(cors());


    app.use(express.static('./public'));
    // app.use('/css', express.static(__dirname + '/css'));
    // app.use('./public/views', express.static(__dirname + '/views'));




    app.get('/', function(req, res){
        console.log('main entrance');
        res.sendFile('index.html', { root: "../public" });
    });

    // Load the routing files
    require('../server/routes/api.routes.js')(app);

    //Return the Express application instance
    return app;
};