const connectToDatabase = require('/opt/services/mongodb');
const Recipes = require('/opt/models/recipes');

module.exports.createRecipes = async function createRecipes(payload) {
	try {
		await connectToDatabase();
		console.log('Payload:', payload);

		const {name, price, status, ingredients} = payload;

		const recipeData = new Recipes();
		recipeData.name = name;
		recipeData.price = price;
		recipeData.status = status;
		recipeData.ingredients = ingredients;
		await recipeData.save();
		return {
			message: 'Recipe created successfully'
		}
	} catch (error) {
		return {
			message: 'Could not authenticate user'
		}
	}
}