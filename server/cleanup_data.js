import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Community from './models/Community.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Deleting Collections...');
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Collections Cleared.');

    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log('Deleting uploads folder...');
      fs.rmSync(uploadsDir, { recursive: true, force: true });
      console.log('Uploads folder deleted.');
    } else {
      console.log('Uploads folder does not exist.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
