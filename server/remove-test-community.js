import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Community from './models/Community.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Connecting to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      const result = await Community.deleteOne({ name: 'TestCommunity_458' });
      console.log('Deletion Result:', result);
      if (result.deletedCount > 0) {
        console.log('Successfully removed TestCommunity_458');
      } else {
        console.log('TestCommunity_458 not found');
      }
    } catch (err) {
      console.error('Error deleting community:', err);
    } finally {
      await mongoose.disconnect();
      console.log('Disconnected');
    }
  })
  .catch(err => {
    console.error('Connection Error:', err);
  });
