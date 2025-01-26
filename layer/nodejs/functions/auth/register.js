const connectToDatabase = require('/opt/services/mongodb');  // เรียกใช้ service ที่สร้างไว้
const jwt = require('jsonwebtoken');  // สำหรับสร้าง JWT token
const User = require('/opt/models/user');  // เรียกใช้ User model

module.exports.registerUser = async function registerUser(payload) {
    try {
        // ตรวจสอบการเชื่อมต่อกับ MongoDB
        await connectToDatabase();

        const {name, email, password, prefix, role, partner, reseller} = payload
        // ตรวจสอบว่ามีผู้ใช้ที่ใช้ email เดียวกันหรือไม่
        const existingUser = await User.findOne({email});
        if (existingUser) {
            console.error('Email already registered');
            throw new Error('Email is already registered');
        }

        // สร้างผู้ใช้ใหม่และบันทึกในฐานข้อมูล
        console.log('Creating new user...');
        const newUser = new User({
            partner,
            reseller,
            role,
            prefix,
            name,
            email,
            password,  // บันทึกรหัสผ่านตรงๆ โดยไม่แฮช
            createdAt: new Date()
        });

        // สร้าง JWT token สำหรับผู้ใช้ใหม่
        const token = jwt.sign(
            {userId: newUser._id, email: newUser.email},
            process.env.JWT_SECRET,  // ใช้ secret key จาก environment variables
            {expiresIn: '1h'}  // กำหนดให้ token หมดอายุใน 1 ชั่วโมง
        );

        newUser.token = token;
        console.log('Attempting to save user...', newUser);

        // บันทึกข้อมูลผู้ใช้ใน MongoDB
        await newUser.save();
        console.log('User saved successfully:', newUser);

        // ส่งคืนข้อมูลผู้ใช้และ JWT token
        return {
            token,  // ส่ง JWT token กลับไป
            email: newUser.email,
            name: newUser.name,
            message: 'User registered successfully'
        };

    } catch (error) {
        console.error('Error during registration:', error.message);  // แสดงข้อความข้อผิดพลาด
        console.error('Stack Trace:', error.stack);  // แสดงรายละเอียดของข้อผิดพลาด
        throw new Error('Registration failed');
    }
};