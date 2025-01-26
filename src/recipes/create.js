const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const {createRecipes} = require('/opt/functions/recipes/create');
const ResponseBuilder = require('/opt/responseHelper');

const extractToken = (event) => {
	return event.headers.Authorization || event.headers.authorization;
}

const createPayload = (body) => {
	return {
		name: body.name,
		price: body.price,
		status: body.status,
		ingredients: body.ingredients
	};
}

exports.handler = async (event) => {
	try {
		const body = JSON.parse(event.body);
		const token = extractToken(event);
		if (!token) {
			throw new Error('Token not provided');
		}
		const profile = await tokenVerifier.getProfile(token);
		if (profile.role !== 'admin') {
			throw new Error('Unauthorized');
		}
		const payload = createPayload(body);
		await createRecipes(payload);
		return ResponseBuilder.success("success", 201);
	} catch (error) {
		console.error('Error getting profile:', error);
		return ResponseBuilder.error('Could not authenticate user', 401, error.message);
	}
}
