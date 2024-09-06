// Load the module dependencies
var express = require('./config/express'),
    mongoose = require('./config/mongoose');

// create a new Mongoose connection instance
var db = mongoose();

// create a new Express application instance
var app = express();
// create a http module from express



var server = require('http').createServer(app);

// Set The Port
app.set('port', 8080);

// Start the server
server.listen(app.get('port'), function() {
    console.log('Express server listening on port '+ server.address().port +' ..');
});