import Community from './models/Community.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

console.log('Testing Community Creation...');

// Mock Request simulation isn't easy without running server, 
// but we can test the Model validation and DB connection directly first.
// Or effectively we can use `fetch` if the server is running.
// The user has `npm run start` running.

const testCreate = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'TestCommunity_' + Math.floor(Math.random() * 1000),
        description: 'Test Description',
        userId: new mongoose.Types.ObjectId().toString(), // Random valid ID
        privacy: 'public',
        rules: 'No rules'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.status === 201) {
      console.log('SUCCESS: Community created.');
    } else {
      console.log('FAILED: ' + data.message);
    }

  } catch (err) {
    console.error('Fetch Error:', err);
  }
};

testCreate();
