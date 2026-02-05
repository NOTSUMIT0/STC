import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import resourceRoutes from './routes/resources.js';
import communityRoutes from './routes/communities.js';
import commentRoutes from './routes/comments.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/comments', commentRoutes);

// Database Connection
console.log('Attempting to connect to MongoDB...');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-platform')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Possible Fix: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0)');
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
