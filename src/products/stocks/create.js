const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const productStockCreator = require('/opt/functions/products/stocks/create');
const productUpdater = require('/opt/functions/products/update');


exports.handler = async (event) => {
	try {
		const body = JSON.parse(event.body);
		const token = event.headers.Authorization || event.headers.authorization;

		if (!token) {
			throw new Error('Token not provided');
		}

		const profile = await tokenVerifier.getProfile(token);
		if (profile.role !== 'admin') {
			throw new Error('Unauthorized');
		}

		const createPayload = (keys) => {
			return keys.reduce((payload, key) => {
				payload[key] = body[key];
				return payload;
			}, {});
		};

		const productPayload = createPayload(['product_id', 'quantity']);
		const stockPayload = createPayload(['warehouse_id', 'stock_id', 'product_id', 'quantity']);


		await productStockCreator.createProductStocks(profile, stockPayload);
		await productUpdater.addStockQuantity(profile, productPayload);

		return {
			statusCode: 201,
			body: "Success"
		};

	} catch (error) {
		console.error('Error getting profile:', error);
		throw {
			statusCode: 401,
			body: JSON.stringify({
				message: 'Could not authenticate user',
				error: error.message
			})
		};
	}
};