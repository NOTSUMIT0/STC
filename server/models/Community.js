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
    maxlength: 500,
  },
  rules: {
    type: String, // Or Array of strings if we want structured rules
  },
  privacy: {
    type: String,
    enum: ['public', 'restricted', 'private'],
    default: 'public'
  },
  icon: {
    type: String,
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
