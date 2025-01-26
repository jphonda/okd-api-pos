const mongoose = require('mongoose');

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {  // ตรวจสอบว่าเชื่อมต่ออยู่หรือไม่
        try {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw new Error('Failed to connect to MongoDB');
        }
    }
};

module.exports = connectToDatabase;