const connectToDatabase = require('/opt/services/mongodb');
const ProductStocks = require('/opt/models/product_stocks');

const productStockCreator = {
	createProductStocks: async (profile, payload) => {
		try {
			await connectToDatabase();
			const productStocks = new ProductStocks();
			productStocks.prefix = profile.prefix;
			productStocks.warehouse_id = payload.warehouse_id;
			productStocks.product_id = payload.product_id;
			productStocks.quantity = payload.quantity || 0;
			productStocks.receivedDate = payload.receivedDate || 0;
			productStocks.expiryDate = payload.expiryDate || 0;
			productStocks.lotNumber = payload.lotNumber || 0;
			productStocks.location = payload.location || "";
			await productStocks.save();
			return productStocks;
		} catch (error) {
			console.error('Error creating product stocks:', error);
			throw new Error('Error occurred while creating product stocks');
		}
	}
}

module.exports = productStockCreator;