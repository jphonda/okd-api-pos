const tokenVerifier = require('/opt/functions/auth/tokenVerifier');

const CONSTANTS = {
	TOKEN_NOT_PROVIDED: 'Token not provided',
	COULD_NOT_AUTHENTICATE: 'Could not authenticate user',
	UNAUTHORIZED: 401,
	SUCCESS: 200
};

const extractToken = headers => headers.Authorization || headers.authorization;

const createUserProfile = user => ({
	email: user.email, name: user.name, role: user.role, prefix: user.prefix
});

const handleSuccessfulResponse = user => ({
	statusCode: CONSTANTS.SUCCESS, body: JSON.stringify(createUserProfile(user))
});

const handleErrorResponse = error => ({
	statusCode: CONSTANTS.UNAUTHORIZED,  // Unauthorized
	body: JSON.stringify({
		message: CONSTANTS.COULD_NOT_AUTHENTICATE, error: error.message
	})
});

exports.handler = async (event) => {
	try {
		const token = extractToken(event.headers);
		if (!token) {
			throw new Error(CONSTANTS.TOKEN_NOT_PROVIDED);
		}
		const user = await tokenVerifier.getProfile(token);
		return handleSuccessfulResponse(user);

	} catch (error) {
		console.error('Error getting profile:', error);
		return handleErrorResponse(error);

	}
};