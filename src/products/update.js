const authService = require('/opt/utils/authService');
const responseBuilder = require('/opt/utils/responseBuilder');

exports.handler = async (event) => {
    try{
        const token = authService.getTokenFromHeaders(event.headers)
        const profile = await authService.validateAdminAccess(token);
        const payload = event.body ? JSON.parse(event.body) : null;

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