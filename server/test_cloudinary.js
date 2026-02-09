import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Testing Cloudinary Connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret (mask):', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.slice(0, 3) + '...' : 'MISSING');

cloudinary.api.ping()
  .then(res => console.log('✅ Connection Success!', res))
  .catch(err => {
    console.error('❌ Connection Failed:', err);
    process.exit(1);
  });
