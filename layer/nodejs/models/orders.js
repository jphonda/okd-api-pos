const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    prefix: {type: String},
    userId: {type: String},
    totalAmount: {type: Number},
    status: {type: String},
    items: {type: Array},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
})

const Orders = mongoose.model('Order', orderSchema, 'order-orders-devs')

module.exports = Orders;