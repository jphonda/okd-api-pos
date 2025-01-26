const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const productCreator = require('/opt/functions/products/create');

class ResponseBuilder {
	static success(data, statusCode = 200) {
		return {
			statusCode,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify(data)
		};
	}

	static error(message, statusCode = 400, error = null) {
		return {
			statusCode,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				message,
				error: error?.message || error
			})
		};
	}
}

class AuthService {
	static getTokenFromHeaders(headers) {
		const token = headers.Authorization || headers.authorization;
		if (!token) {
			throw new Error('Token not provided');
		}
		return token.replace('Bearer ', '');
	}

	static async validateAdminAccess(token) {
		const profile = await tokenVerifier.getProfile(token);
		if (profile.role !== 'admin') {
			throw new Error('Unauthorized: Admin access required');
		}
		return profile;
	}
}

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
		const token = AuthService.getTokenFromHeaders(event.headers);

		// Validate admin access
		const profile = await AuthService.validateAdminAccess(token);

		// Parse and validate payload
		const payload = event.body ? JSON.parse(event.body) : null;

		// Create product
		const result = await ProductService.createProduct(profile, payload);

		// Return success response
		return ResponseBuilder.success(result, 201);

	} catch (error) {
		console.error('Error in product creation:', error);

		// Handle specific error types
		if (error.message.includes('Token not provided') || error.message.includes('Unauthorized')) {
			return ResponseBuilder.error('Authentication failed', 401, error);
		}

		if (error instanceof SyntaxError) {
			return ResponseBuilder.error('Invalid request payload', 400, error);
		}

		// Handle unexpected errors
		return ResponseBuilder.error('Internal server error', 500, error);
	}
};