const connectToDatabase = require('/opt/services/mongodb');
const Product = require('/opt/models/product');


const productUpdater = {
	addStockQuantity: async function (profile , payload) {
		try {
			await connectToDatabase();
			const product = await Product.findOne({_id: payload.product_id});
			if (payload.quantity != null) {
				const add = (product.stockQuantity || 0) + (payload.quantity || 0);
				payload.stockQuantity = add;
			}
			await Product.findOneAndUpdate({_id: payload.product_id}, {$set: payload}, {new: true});
			return {
				message: 'stockQuantity updated successfully'
			}
		} catch (error) {
			return {
				message: 'Could not authenticate user'
			};
		}
	},
	deductStockQuantity: async function (profile , payload) {
		try {
			await connectToDatabase();
			const product = await Product.findOne({_id: payload.product_id});
			if (payload.quantity != null) {
				const deduct = (product.stockQuantity || 0) - (payload.quantity || 0);
				payload.stockQuantity = deduct;
			}
			await Product.findOneAndUpdate({_id: payload.product_id}, {$set: payload}, {new: true});
			return {
				message: 'stockQuantity updated successfully'
			}

		} catch (error) {
			return {
				message: 'Could not authenticate user'
			};
		}
	}
}

module.exports = productUpdater;