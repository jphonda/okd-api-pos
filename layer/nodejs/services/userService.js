import connectToDatabase from '/opt/services/mongodb.js';  // ใช้ฟังก์ชัน connectToDatabase สำหรับเชื่อมต่อ MongoDB
import bcrypt from 'bcrypt';

// ฟังก์ชันสำหรับการสร้างผู้ใช้ใหม่
export async function createUser(userData) {
    const client = await connectToDatabase(process.env.MONGODB_URI);  // เชื่อมต่อกับ MongoDB
    const db = client.db('your-database-name');  // เปลี่ยนเป็นชื่อ database ของคุณ
    const collection = db.collection('users');   // ใช้ collection ชื่อ 'users'

    // เช็คว่า email ซ้ำหรือไม่
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // แฮช password ก่อนบันทึก
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
    };

    // บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
    const result = await collection.insertOne(newUser);
    return result.ops[0];  // ส่งคืนผู้ใช้ที่สร้างสำเร็จ
}

// ฟังก์ชันสำหรับการค้นหาผู้ใช้ตาม email
export async function findUserByEmail(email) {
    const client = await connectToDatabase(process.env.MONGODB_URI);
    const db = client.db('your-database-name');
    const collection = db.collection('users');

    const user = await collection.findOne({ email });
    return user;  // ส่งคืนข้อมูลผู้ใช้ (หรือ null หากไม่พบ)
}