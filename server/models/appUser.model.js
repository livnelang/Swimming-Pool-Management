//Load the module dependencies
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Define a new 'AppUserSchema'
var appUserSchema = new Schema({
    name: String,
    password: String,
    admin: Boolean
},{collection: 'appUsers'});

// Create the 'appUserSchema' model out of the 'AppUserSchema'
mongoose.model('AppUser',appUserSchema);

