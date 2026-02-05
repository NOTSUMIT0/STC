import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGO_URI ? 'Loaded (Hidden)' : 'Not Found');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-platform');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database connection is working fine.');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Ensure your IP is whitelisted in MongoDB Atlas or your local MongoDB is running.');
    process.exit(1);
  }
};

connectDB();
