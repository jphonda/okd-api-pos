const jwt = require('jsonwebtoken');
const User = require('/opt/models/user');  // เรียกใช้ User model

const tokenVerifier = {
	getProfile: async function (token) {
		try {
			// ตรวจสอบและถอดรหัส JWT token
			await console.log(token)
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log('Decoded JWT:', decoded);

			// เชื่อมต่อกับ MongoDB (อย่าลืมเรียกใช้ฟังก์ชัน connectToDatabase ในไฟล์ที่จำเป็น)
			await require('/opt/services/mongodb')();

			// ค้นหาผู้ใช้จาก userId ที่ได้จากการถอดรหัส JWT
			const user = await User.findById(decoded.userId);
			if (!user) {
				throw new Error('User not found');
			}

			// // ตรวจสอบว่า token จาก request ตรงกับ token ที่เก็บไว้ในฐานข้อมูลหรือไม่
			if (user.token !== token.replace('Bearer ', '')) {
				throw new Error('Invalid token');
			}

			// ส่งคืนข้อมูลผู้ใช้หากทุกอย่างถูกต้อง
			return user;

		} catch (error) {
			console.error('Token verification or user lookup failed:', error);
			throw new Error('Token validation failed');
		}
	}
}

module.exports = tokenVerifier;
