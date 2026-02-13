import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from server root (one level up)
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('--- STARTING CLEANUP ---');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not Set');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set');

const wipeData = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 2. Drop Database
    await mongoose.connection.db.dropDatabase();
    console.log('MongoDB Database dropped successfully.');

    // 3. Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // 4. Delete All Resources from Cloudinary
    // Note: This deletes all resources with the prefix 'stc_platform' if you used a folder, 
    // or we can try to delete everything if no folder was used, but that's risky if the cloud is shared.
    // Assuming 'stc' folder or similar based on previous config. If not, we might need to list and delete.
    // simpler approach for dev: delete all derived resources and then original.

    console.log('Cleaning Cloudinary...');

    // Delete all resources (this might take time and has rate limits, be careful in prod)
    // api.delete_all_resources is a comprehensive wipe.
    await cloudinary.api.delete_all_resources();
    console.log('Cloudinary resources deleted.');

    // Check if we need to delete folders too
    // await cloudinary.api.delete_folder('stc_uploads'); 

    console.log('--- CLEANUP COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

wipeData();
