const connectToDatabase = require('/opt/services/mongodb');
const Categories = require('/opt/models/categories');

const CategoriesCreator = {
	create: async (payload) => {
		try {
			await connectToDatabase();
			console.log('Payload:', payload);
			const categories = new Categories();
			categories.name = payload.body.name;
			categories.prefix = payload.profile.prefix;
			categories.description = payload.body.description;
			categories.createdAt = new Date();
			categories.createdBy = payload.profile.name;
			await categories.save();
			return categories;

		} catch (error) {
			return {
				message: 'Could not authenticate user'
			}
		}
	}
}

module.exports = CategoriesCreator;