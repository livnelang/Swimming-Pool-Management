//Load the module dependencies
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Define a new 'clientSchema'
var clientSchema = new Schema({
    firstName: {type: String, required : true},
    lastName: {type: String, required : true}
},{collection: 'clients'});

// Unique indexes
clientSchema.index({firstName: 1, lastName: 1}, {unique: true});

// Create the 'client' model out of the 'clientSchema'
mongoose.model('Client',clientSchema);

