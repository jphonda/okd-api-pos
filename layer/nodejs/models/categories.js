const mongoose = require('mongoose')
const CategoriesSchema = new mongoose.Schema({
    name: {type: String, required: true},
    prefix: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: String, required: true}
})

const Categories = mongoose.model('Categories', CategoriesSchema, 'categories-categories-devs')

module.exports = Categories
