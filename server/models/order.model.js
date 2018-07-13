//Load the module dependencies
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Define a new 'corderSchema'
var corderSchema = new Schema({
    accountNumber: {type: Number, required : true},
    productName: {type: String, required : true},
    pricePerProduct: {type: Number, required : true},
    quantity: {type: Number, required : true},
    date: {type: Date, required : true}
},{collection: 'orders'});

// Create the 'order' model out of the 'corderSchema'
mongoose.model('Order',corderSchema);