const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

	name: {type: String, required: true},
	prefix: {type: String, required: true},
	categoryId: {type: String, required: true},
	price: {type: Number, required: true},
	stockQuantity: {type: Number},
	unit: {type: String, required: true},
	isIngredient: {type: Boolean},
	status: {type: String, required: true},
	conversionUnit: {type: Object},
	createdAt: {type: Date, default: Date.now},
	createdBy: {type: String, required: true}
	
});

const Product = mongoose.model('Product', productSchema, 'product-products-devs');
module.exports = Product;