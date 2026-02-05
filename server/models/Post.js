import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'poll'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String, // For text posts
    trim: true,
  },
  options: [{ // For polls
    text: String,
    votes: {
      type: Number,
      default: 0,
    },
  }],
  author: {
    username: {
      type: String,
      required: true,
    },
    avatarSeed: { // For dicebear
      type: String,
      default: 'Felix',
    },
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Post', postSchema);
