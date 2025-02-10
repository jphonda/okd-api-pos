const mongoose = require('mongoose');

const ProductStockSchema = new mongoose.Schema({
	prefix: {type: String, required: true},
	product_id: {type: String, required: true},
	warehouse_id: {type: String},
	quantity: {type: Number},
	receivedDate: {type: Date},
	expiryDate: {type: Date},
	lotNumber: {type: Number},
	location: {type: String}
});

const ProductStocks = mongoose.model('ProductStocks', ProductStockSchema, 'product-stocks-devs');
module.exports = ProductStocks;