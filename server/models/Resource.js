import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['link', 'note', 'library', 'video', 'file', 'other'],
    default: 'link',
  },
  description: {
    type: String,
    trim: true,
  },
  // For 'link', 'library', 'video' types
  url: {
    type: String,
    trim: true,
  },
  // For 'note' type (Markdown/Text)
  content: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: false, // Default to private
  },
  // Scalability: Flexible Object for any future specific fields without schema migration
  meta: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Index for faster searching
resourceSchema.index({ title: 'text', tags: 'text' });

export default mongoose.model('Resource', resourceSchema);
