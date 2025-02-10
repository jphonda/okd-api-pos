const authService = require('/opt/utils/authService');
const responseBuilder = require('/opt/utils/responseBuilder');
const productUpdater = require('/opt/functions/products/update');
const productStockCreator = require('/opt/functions/products/stocks/create');

exports.handler = async (event) => {
    try{
        const token = authService.getTokenFromHeaders(event.headers)
        const profile = await authService.validateAdminAccess(token);
        const payload = event.body ? JSON.parse(event.body) : null;

        const { type } = payload;
        payload.product_id = event.pathParameters.id;

        if(type === 'add') {
            await productUpdater.addStockQuantity(profile, payload);
            await productStockCreator.create(profile, payload);
        }

        if(type === 'deduct'){
            await productUpdater.deductStockQuantity(profile, payload);
        }
        return responseBuilder.success('success', 200);

    }catch(error){
        console.log('Error in product update:', error);
        if (error.message.includes('Token not provided') || error.message.includes('Unauthorized')) {
            return responseBuilder.error('Authentication failed', 401, error);
        }
        if (error instanceof SyntaxError) {
            return responseBuilder.error('Invalid request payload', 400, error);
        }
        return responseBuilder.error('Internal server error', 500, error);

    }

}