const productCreator = require('/opt/functions/products/create');
const authService = require('/opt/utils/authService');
const responseBuilder = require('/opt/utils/responseBuilder');

class ProductService {
	static async createProduct(profile, payload) {
		if (!payload) {
			throw new Error('Product payload is required');
		}
		return await productCreator.create(profile, payload);
	}
}

exports.handler = async (event) => {
	try {
		// Extract and validate token
		const token = authService.getTokenFromHeaders(event.headers);
		const profile = await authService.validateAdminAccess(token);
		const payload = event.body ? JSON.parse(event.body) : null;
		const result = await ProductService.createProduct(profile, payload);

		// Return success response
		return responseBuilder.success(result, 201);

	} catch (error) {
		console.error('Error in product creation:', error);
		if (error.message.includes('Token not provided') || error.message.includes('Unauthorized')) {
			return responseBuilder.error('Authentication failed', 401, error);
		}
		if (error instanceof SyntaxError) {
			return responseBuilder.error('Invalid request payload', 400, error);
		}
		return responseBuilder.error('Internal server error', 500, error);
	}
};