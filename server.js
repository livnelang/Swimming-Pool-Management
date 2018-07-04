// Load the module dependencies
var express = require('./config/express'),
    mongoose = require('./config/mongoose');

// create a new Mongoose connection instance
var db = mongoose();
// create a new Express application instance
var app = express();
// create a http module from express
var server = require('http').createServer(app);
// create a new io module as socket io
var io = socket(server);

// Set The Port
app.set('port', process.env.PORT || 3000);

// Start the server
server.listen(app.get('port'), function() {
    console.log('Express server listening on port '+ server.address().port +' ..');
});