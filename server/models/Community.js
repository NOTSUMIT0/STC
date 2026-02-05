import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30, // Limit Name length
  },
  description: {
    type: String,
    maxlength: 500, // Limit Description
  },
  icon: {
    type: String, // URL or Dicebear seed
    default: 'stc-community',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Index for getting popular communities or searching
communitySchema.index({ name: 'text' });

export default mongoose.model('Community', communitySchema);
