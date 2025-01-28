const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const categoriesCreator = require('/opt/functions/categories/create');
const ADMIN_ROLE = ['admin', 'superadmin'];

const authorizeUserProfile = async (authorizationToken) => {
	if (!authorizationToken) {
		throw new Error('Token not provided');
	}
	const profile = await tokenVerifier.getProfile(authorizationToken);
	if (!profile.role.includes(ADMIN_ROLE)) {
		throw new Error('Unauthorized');
  }
};

exports.handler = async (event) => {
	try {
		let requestPayload = {};
		const authorizationToken = event.headers.Authorization || event.headers.authorization;
		requestPayload.profile = await authorizeUserProfile(authorizationToken);
		requestPayload.body = JSON.parse(event.body);
		const categories = await categoriesCreator.create(requestPayload);
    
    console.log('Categories created:', categories);

     
		return {
			statusCode: 201,
			body: JSON.stringify(categories)
		};
	} catch (authError) {
		console.error('Error getting profile:', authError);
		return {
			statusCode: 401,  // Unauthorized
			body: JSON.stringify({
				message: 'Could not authenticate user', error: authError.message
			}) };
	}
}
