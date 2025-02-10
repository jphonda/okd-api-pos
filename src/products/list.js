const {searchInModelWithStock} = require('/opt/utils/searchInModel');
const Product = require('/opt/models/product');
const authService = require('/opt/utils/authService');

exports.handler = async (event) => {
	try {
		const token = authService.getTokenFromHeaders(event.headers);
		const profile = await authService.validateAdminAccess(token);
		const param = event.queryStringParameters;
		console.log('Param:', param);
		const items = await searchInModelWithStock(Product, profile.prefix, param);
		return {
			statusCode: 200, body: JSON.stringify(items)
		};
	} catch (error) {
		console.error('Error getting profile:', error);
		return {
			statusCode: 401,  // Unauthorized
			body: JSON.stringify({
				message: 'Could not authenticate user', error: error.message
			})
		};
	}
}

