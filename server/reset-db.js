
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resetDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }

    // Clear uploads
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      // Function to recursively clean directories but keep the structure or just empty them
      // For now, let's just empty the specific folders we know
      const folders = ['communities', 'posts', 'profiles']; // Add others if needed
      folders.forEach(folder => {
        const folderPath = path.join(uploadsDir, folder);
        if (fs.existsSync(folderPath)) {
          fs.readdirSync(folderPath).forEach(file => {
            if (file !== '.gitkeep') {
              fs.unlinkSync(path.join(folderPath, file));
            }
          });
          console.log(`Cleared uploads/${folder}`);
        }
      });
    }

    console.log('Database and uploads reset successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting DB:', err);
    process.exit(1);
  }
};

resetDb();
