const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const {searchInModelWithStock} = require('/opt/utils/searchInModel');
const ProductStocks = require('/opt/models/product_stocks');

const validateToken = async (token) => {
	if (!token) {
		throw new Error('Token not provided');
	}
	const profile = await tokenVerifier(token);
	if (profile.role !== 'admin') {
		throw new Error('Unauthorized');
	}
	return profile;
};

const createErrorResponse = (error) => {
	console.error('Error getting profile:', error);
	return {
		statusCode: 401,  // Unauthorized
		body: JSON.stringify({
			message: 'Could not authenticate user',
			error: error.message
		})
	};
};

exports.handler = async (event) => {
	try {
		const profile = await validateToken(event.headers.Authorization || event.headers.authorization);
		console.log('Profile:', profile);
		const queryParams = event.queryStringParameters;
		console.log('Param:', queryParams);
		const productStocksResult = await searchInModelWithStock(ProductStocks, profile.prefix, queryParams);
		return {
			statusCode: 200,
			body: JSON.stringify(productStocksResult)
		};
	} catch (error) {
		return createErrorResponse(error);
	}
};