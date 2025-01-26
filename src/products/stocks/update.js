const updateProductStocks = require('/opt/functions/products/stocks/update');
const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const productUpdater = require('/opt/functions/products/update');

function validateEventBody(body) {
	const {product_id, quantity, stock_id, actionType, warehouse_id} = body;
	return [product_id, quantity, stock_id, actionType, warehouse_id].every(Boolean);
}

async function getAuthenticatedProfile(token) {
	if (!token) {
		return null;
	}
	return tokenVerifier.getProfile(token).catch((err) => {
		return null;
	});
}

function isAuthorized(profile) {
	return profile && profile.role === 'admin';
}

async function updateStockAndProduct(profile, details, actionType) {
	if (actionType !== 'add' && actionType !== 'deduct') {
		return null;
	}
	const method = actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'Quantity';
	const stockResult = await updateProductStocks[method](profile, details);
	if (stockResult.success) {
		return await productUpdater[method](profile, {product_id: details.product_id, quantity: details.quantity});
	}
	return stockResult;
}

exports.handler = async (event) => {
	try {
		const body = JSON.parse(event.body || '{}');

		if (!validateEventBody(body)) {
			return {statusCode: 400, body: JSON.stringify({message: 'Missing required fields'})};
		}

		const token = event.headers.Authorization || event.headers.authorization;
		const profile = await getAuthenticatedProfile(token);

		if (!isAuthorized(profile)) {
			return {statusCode: 403, body: JSON.stringify({message: 'Unauthorized'})};
		}

		const result = await updateStockAndProduct(profile, {...body}, body.actionType);
		if (!result || !result.success) {
			return {
				statusCode: 400,
				body: JSON.stringify({message: result ? result.message : 'Invalid action type specified'})
			};
		}

		return {statusCode: 200, body: JSON.stringify({message: 'Operation successful'})};

	} catch (error) {
		return {statusCode: 500, body: JSON.stringify({message: 'An error occurred', error: error.message})};
	}
};