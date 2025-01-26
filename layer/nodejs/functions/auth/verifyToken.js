const jwt = require('jsonwebtoken');

module.exports.verifyToken = function(token) {
    try {
        // ตรวจสอบและถอดรหัส JWT token
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded);

        return decoded;  // ส่งคืนข้อมูลที่ถอดรหัสแล้ว
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid token');
    }
};