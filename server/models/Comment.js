import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null, // If null, it's a top-level comment
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
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
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Comment', commentSchema);
