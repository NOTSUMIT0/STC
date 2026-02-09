import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'Length: ' + process.env.CLOUDINARY_API_KEY.length : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'PRESENT' : 'MISSING'
});

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || '';
const api_key = process.env.CLOUDINARY_API_KEY || '';
const api_secret = process.env.CLOUDINARY_API_SECRET || '';

cloudinary.config({
  cloud_name: cloud_name.trim(),
  api_key: api_key.trim(),
  api_secret: api_secret.trim(),
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stc-uploads',
    resource_type: 'auto', // Auto-detect (image, video, raw)
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
