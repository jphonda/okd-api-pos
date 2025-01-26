const connectToDatabase = require('/opt/services/mongodb');
const Product = require('/opt/models/product');

const createProductObject = (profile, payload) => {
	return {
		name: payload.name || "Unnamed Product",
		prefix: profile?.prefix || "unknown",
		categoryId: payload.categoryId || null,
		price: payload.price || 0,
		stockQuantity: payload.stockQuantity || 0,
		unit: payload.unit || "unit",
		isIngredient: payload.isIngredient || false,
		status: payload.status || "inactive",
		conversionUnit: payload.conversionUnit || null,
		createdAt: new Date(),
		createdBy: profile?.name || "System"
	};
};

const productCreator = {
	create: async (profile, payload) => {
		try {
			await connectToDatabase();
			const productObject = createProductObject(profile, payload);
			const newProduct = new Product(productObject);
			await newProduct.save();
			console.log('Product saved successfully:', newProduct);
			return {
				message: 'Product created successfully',
				data: newProduct
			};
		} catch (error) {
			return {
				message: 'Could not authenticate user'
			};
		}
	}
};

module.exports = productCreator;