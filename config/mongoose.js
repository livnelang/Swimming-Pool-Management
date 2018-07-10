// Load the module dependencies
var mongoose = require('mongoose');

// Define the Mongoose configuration schemas
module.exports = function() {
    //Connect to MongoDB with Mongoose
    var db = mongoose.connect('mongodb://poolAdmin:1a2s3d4f@ds129321.mlab.com:29321/swimming-pool');


    db = mongoose.connection;
    //Load the application models

    require('../server/models/client.model');
    require('../server/models/order.model');
    require('../server/models/appUser.model');

    //Return the Mongoose connection instance
    return db;
};