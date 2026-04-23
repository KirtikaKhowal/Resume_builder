const mongoose = require('mongoose');

// Local MongoDB connection (ab koi Atlas nahi)
const MONGODB_URI = 'mongodb://localhost:27017/resume_builder';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;