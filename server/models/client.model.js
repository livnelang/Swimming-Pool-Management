//Load the module dependencies
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Define a new 'clientSchema'
var clientSchema = new Schema({
    firstName: {type: String, required : true},
    lastName: {type: String, required : true},
    accountNumber: {type: Number, unique : true, required : true}
},{collection: 'clients'});

// Create the 'client' model out of the 'clientSchema'
mongoose.model('Client',clientSchema);

