const {verifyAndCheckToken} = require('/opt/functions/auth/verifyAndCheckToken');  // เรียกใช้ฟังก์ชันจาก Layer
const {createOrders} = require('/opt/functions/orders/create');  // เรียกใช้ฟังก์ชันจาก Layer

exports.handler = async (event) => {
    try {
        // ดึง JWT token จาก headers
        let payload = {};
        const token = event.headers.Authorization || event.headers.authorization;
        if (!token) {
            throw new Error('Token not provided');
        }
        // กำหนดข้อมูล payload
        payload.profile = await verifyAndCheckToken(token);
        if (payload.profile.role !== 'admin') {
            throw new Error('Unauthorized');
        }

        payload.body = JSON.parse(event.body);

        const result = await createOrders(payload);

        return {
            statusCode: 201,  // ส่งกลับ HTTP status 201 (Created)
            body: JSON.stringify(result)  // ส่ง JWT token และข้อมูลผู้ใช้ที่ลงทะเบียนสำเร็จกลับไป
        };

    } catch (error) {
        console.error('Error getting profile:', error);
        return {
            statusCode: 401,  // Unauthorized
            body: JSON.stringify({
                message: 'Could not authenticate user',
                error: error.message
            })
        };
    }
};