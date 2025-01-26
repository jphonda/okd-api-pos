const mongoose = require('mongoose');

// กำหนด schema
const userSchema = new mongoose.Schema({
	role: {type: String, required: true},
	partner: {type: String, required: true},
	reseller: {type: String},
	prefix: {type: String},
	warehouse_id: {type: String},
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	token: {type: String},
	createdAt: {type: Date, default: Date.now}
});

// ระบุชื่อ collection ให้ตรงกับที่อยู่ใน MongoDB ('user-users-devs')
const User = mongoose.model('User', userSchema, 'user-users-devs');

module.exports = User;