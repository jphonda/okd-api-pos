const connectToDatabase = require('/opt/services/mongodb');
const ProductStocks = require('/opt/models/product_stocks');

const updateProductStocks = {
	addQuantity: async (profile, payload) => {
		try {
			await connectToDatabase();

			const productStock = await ProductStocks.findOne({ _id: payload.stock_id });
			if (!productStock) return { success: false, message: 'Stock not found' };

			if (productStock.warehouse_id !== payload.warehouse_id && profile.warehouse_id !== payload.warehouse_id) {
				return { success: false, message: 'Warehouse ID does not match' };
			}

			const updatedQuantity = productStock.quantity + payload.quantity;
			await ProductStocks.findOneAndUpdate(
				{ _id: payload.stock_id },
				{ $set: { ...payload, quantity: updatedQuantity, prefix: profile.prefix } },
				{ new: true }
			);

			return { success: true, message: 'Stock quantity updated successfully' };

		} catch (error) {
			console.error('Error adding stock:', error.message);
			return { success: false, message: 'An error occurred while updating stock' };
		}
	},

	deductQuantity: async (profile, payload) => {
		try {
			await connectToDatabase();

			const productStock = await ProductStocks.findOne({ _id: payload.stock_id });
			if (!productStock) return { success: false, message: 'Stock not found' };

			if (productStock.warehouse_id !== payload.warehouse_id && profile.warehouse_id !== payload.warehouse_id) {
				return { success: false, message: 'Warehouse ID does not match' };
			}

			if (productStock.quantity < payload.quantity) {
				return { success: false, message: 'Insufficient stock quantity' };
			}

			const updatedQuantity = productStock.quantity - payload.quantity;
			await ProductStocks.findOneAndUpdate(
				{ _id: payload.stock_id },
				{ $set: { ...payload, quantity: updatedQuantity } },
				{ new: true }
			);

			return { success: true, message: 'Stock quantity updated successfully' };

		} catch (error) {
			console.error('Error deducting stock:', error.message);
			return { success: false, message: 'An error occurred while updating stock' };
		}
	},
};

module.exports = updateProductStocks;