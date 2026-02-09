import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing Cloudinary Connection...');
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || '';
const api_key = process.env.CLOUDINARY_API_KEY || '';
const api_secret = process.env.CLOUDINARY_API_SECRET || '';

console.log(`Cloud Name: '${cloud_name}' (Length: ${cloud_name.length})`);
console.log(`API Key:    '${api_key}' (Length: ${api_key.length})`);
console.log(`API Secret: '${api_secret.substring(0, 5)}...' (Length: ${api_secret.length})`);

cloudinary.config({
  cloud_name: cloud_name.trim(),
  api_key: api_key.trim(),
  api_secret: api_secret.trim(),
});

// Test upload of a sample image URL
const sampleImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg';

cloudinary.uploader.upload(sampleImage, { folder: 'stc-test' })
  .then(result => {
    console.log('Upload Successful!');
    console.log('Public ID:', result.public_id);
    console.log('URL:', result.secure_url);
  })
  .catch(err => {
    console.error('Upload Failed:', err);
  });
