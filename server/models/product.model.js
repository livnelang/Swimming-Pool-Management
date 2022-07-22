//Load the module dependencies
var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Define a new 'productSchema'
var productSchema = new Schema({
    name: {type: String, required : true},
    price: {type: Number, required : true}
},{collection: 'products'});

productSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

// Create the 'product' model out of the 'productSchema'
mongoose.model('Product',productSchema);

