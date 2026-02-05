import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'poll', 'image'], // Added 'image' type capability if needed explicitly, though image field handles it
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: false, // Optional for now to support legacy/general posts
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String, // For text posts
    trim: true,
  },
  image: {
    type: String, // URL to uploaded image
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
    avatarSeed: {
      type: String,
      default: 'Felix',
    },
  },
  likes: { // We can use this as 'upvotes'
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Post', postSchema);
