// src/auth/login.js
const {authenticateUser} = require('/opt/functions/auth/login');

// Function to create success response
const createSuccessResponse = (result) => ({
	statusCode: 200,
	body: JSON.stringify({
		message: 'Login successful',
		token: result.token,
		data: {
			email: result.email,
			name: result.name
		}
	}),
});

// Function to create error response
const createErrorResponse = (error) => ({
	statusCode: 401,  // Unauthorized
	body: JSON.stringify({
		message: 'Login failed',
		error: error.message
	}),
});

// Main handler function to process login
exports.handler = async (event) => {
	try {
		const {email, password} = JSON.parse(event.body);
		const result = await authenticateUser(email, password);
		return createSuccessResponse(result);
	} catch (error) {
		return createErrorResponse(error);
	}
};