const tokenVerifier = require('/opt/functions/auth/tokenVerifier');

const authService = {
    getTokenFromHeaders: function (headers) {
        const token = headers.Authorization || headers.authorization;
        if (!token) {
            throw new Error("Token not provided");
        }
        return token.replace('Bearer ', '');
    },

    validateAdminAccess: async function (token) {
        const profile = await tokenVerifier.getProfile(token);
        if (profile.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
        }
        return profile;
    }
}


module.exports = authService;