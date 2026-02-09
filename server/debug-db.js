import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Community from './models/Community.js';
import User from './models/User.js'; // Import User to ensure schema is registered

dotenv.config();

console.log('Connecting to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      console.log('Checking Communities...');
      const comms = await Community.find({});
      console.log(`Found ${comms.length} communities`);

      for (const c of comms) {
        console.log(`Community: ${c.name}`);
        console.log(`  ID: ${c._id}`);
        console.log(`  Creator: ${c.creator} (${typeof c.creator})`);
        console.log(`  Members: ${c.members.length}`);
        // Check if creator is valid
        if (!mongoose.Types.ObjectId.isValid(c.creator)) {
          console.error(`  INVALID CREATOR: ${c.creator}`);
        }
      }

    } catch (err) {
      console.error('Error querying communities:', err);
    } finally {
      await mongoose.disconnect();
      console.log('Disconnected');
    }
  })
  .catch(err => {
    console.error('Connection Error:', err);
  });
