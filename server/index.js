import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.js';

// ... other imports

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Database Connection
console.log('Attempting to connect to MongoDB...');
console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'Yes' : 'No');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-platform')
  .then(() => console.log('MongoDB connected'))
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
