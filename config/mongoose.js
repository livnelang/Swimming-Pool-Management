// Load the module dependencies
var mongoose = require('mongoose');

// Define the Mongoose configuration schemas
module.exports = function () {
    //Connect to MongoDB with Mongoose
    let db = mongoose.connect(
        process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

    db = mongoose.connection;

    // If the connection throws an error
    db.on('error', function (err) {
        console.log(' *** Mongoose connection error ***', err);
    });

    //Load the application models
    require('../server/models/client.model');
    require('../server/models/order.model');
    require('../server/models/appUser.model');

    //Return the Mongoose connection instance
    return db;
};