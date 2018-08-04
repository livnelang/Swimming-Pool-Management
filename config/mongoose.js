// Load the module dependencies
var mongoose = require('mongoose');

// Define the Mongoose configuration schemas
module.exports = function() {
    //Connect to MongoDB with Mongoose
    var db = mongoose.connect(process.env.MONGOLAB_URI, {useNewUrlParser: true } );


    db = mongoose.connection;
    //Load the application models

    require('../server/models/client.model');
    require('../server/models/order.model');
    require('../server/models/appUser.model');

    //Return the Mongoose connection instance
    return db;
};