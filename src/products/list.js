const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const {searchInModelWithStock} = require('/opt/utils/searchInModel');
const Product = require('/opt/models/product');

exports.handler = async (event) => {
	try {
		const token = event.headers.Authorization || event.headers.authorization;
		if (!token) {
			throw new Error('Token not provided');
		}
		const profile = await tokenVerifier.getProfile(token);
		if (profile.role !== 'admin') {
			throw new Error('Unauthorized');
		}
		console.log('Profile:', profile);
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

