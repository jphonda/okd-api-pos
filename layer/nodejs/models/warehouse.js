const mongoose = require('mongoose');

const WareHouseSchema = new mongoose.Schema({
	prefix: {type: String, required: true},
	name: {type: String, required: true},
	location: {type: String},
	type: {type: String},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

const WareHouse = mongoose.model('WareHouse', WareHouseSchema, 'warehouses-warehouses-devs');
module.exports = WareHouse;

