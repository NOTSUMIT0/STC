import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  bio: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  university: { type: String, default: '' },
  hobbies: [{ type: String }],
  avatarType: { type: String, enum: ['seed', 'upload'], default: 'seed' },
  avatarValue: { type: String, default: '' }, // Seed string or file path
}, { timestamps: true });

export default mongoose.model('User', userSchema);
