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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Environment Check:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Sets' : 'Not Set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');

const app = express();
const PORT = process.env.PORT || 5000;

import cookieParser from 'cookie-parser';

// Middleware
import compression from 'compression';
app.use(compression());

const allowedOrigins = ['http://localhost:5173', 'https://stc-client.onrender.com', 'https://stc-platform.onrender.com'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is allowed explicitly, matches localhost, or is a Render subdomain
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }

    return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/comments', commentRoutes);
import supportRoutes from './routes/support.js';
app.use('/api/support', supportRoutes);
import todoRoutes from './routes/todos.js';
app.use('/api/todos', todoRoutes);
import problemRoutes from './routes/problems.js';
app.use('/api/problems', problemRoutes);
import contactRoutes from './routes/contact.js';
app.use('/api/contact', contactRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message || 'Unknown Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

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
