// src/auth/register.js
const {registerUser} = require('/opt/functions/auth/register');  // เรียกใช้ registerUser จาก layer

exports.handler = async (event) => {
    try {


        const result = await registerUser(JSON.parse(event.body));  // ส่งข้อมูลไปยังฟังก์ชันใน Layer เพื่อลงทะเบียนผู้ใช้
        return {
            statusCode: 201,  // ส่งกลับ HTTP status 201 (Created)
            body: JSON.stringify(result)  // ส่ง JWT token และข้อมูลผู้ใช้ที่ลงทะเบียนสำเร็จกลับไป
        };
    } catch (error) {
        return {
            statusCode: 400,  // ถ้ามีข้อผิดพลาดในการลงทะเบียน
            body: JSON.stringify({
                message: error.message || 'Error during registration'
            })
        };
    }
};