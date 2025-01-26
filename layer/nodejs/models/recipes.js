const mongoose = require('mongoose')
const RecipesSchema = new mongoose.Schema({
    prefix: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: String, required: true},
    ingredients: {type: Array, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: String },
})

const Recipes = mongoose.model('Recipes', RecipesSchema, 'recipes-recipes-devs')
module.exports = Recipes
