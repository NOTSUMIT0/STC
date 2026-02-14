import express from 'express';
import Community from '../models/Community.js';
import upload from '../middleware/upload.middleware.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all communities (or search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }
    const communities = await Community.find(query)
      // .populate('members', 'username') // REMOVED: Performance, frontend uses length only
      .sort({ createdAt: -1 }); // Sort by newest for now as sorting by array length needs aggregation or virtual
    res.json(communities);
  } catch (err) {
    console.error('GET /communities error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET my communities (joined by user)
router.get('/my', authenticate, async (req, res) => {
  try {
    const communities = await Community.find({ members: req.user.id });
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create community
router.post('/', authenticate, upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), async (req, res) => {
  try {
    console.log('Creating Community - Body:', req.body);
    console.log('Creating Community - User:', req.user);
    console.log('Creating Community - Files:', req.files);

    const { name, description, rules, privacy } = req.body;
    const userId = req.user.id; // Correctly get from auth token

    // VALIDATION
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description exceeds 500 characters' });
    }
    if (rules && rules.length > 1000) {
      return res.status(400).json({ message: 'Rules exceed 1000 characters' });
    }

    const existing = await Community.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Community name already taken' });

    // Sanitize icon input: ensure it's a string or null
    let iconPath = null;
    if (typeof req.body.icon === 'string') {
      iconPath = req.body.icon;
    }

    // Prioritize file upload
    if (req.files?.['icon'] && req.files['icon'][0]) {
      console.log('Icon File Uploaded:', req.files['icon'][0].path);
      iconPath = req.files['icon'][0].path;
    }

    let bannerPath = null;
    if (typeof req.body.banner === 'string') {
      bannerPath = req.body.banner;
    }
    if (req.files?.['banner'] && req.files['banner'][0]) {
      console.log('Banner File Uploaded:', req.files['banner'][0].path);
      bannerPath = req.files['banner'][0].path;
    }

    // Fallback for icon
    if (!iconPath) {
      iconPath = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
    }

    const newCommunity = new Community({
      name,
      description,
      rules,
      privacy,
      icon: iconPath,
      banner: bannerPath,
      creator: userId,
      members: [userId],
    });

    const saved = await newCommunity.save();
    console.log('Community Created Successfully:', saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Community Creation Error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'Failed to create community' });
  }
});

// PUT update community
router.put('/:id', authenticate, (req, res, next) => {
  upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'banner', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.error('Upload Middleware Error:', err);
      return res.status(400).json({ message: `Upload Failed: ${err.message}` });
    }
    console.log('Upload Middleware Passed');
    next();
  });
}, async (req, res) => {
  console.log('PUT Community: Route handler reached');
  try {
    const { description, rules, privacy } = req.body;

    // Check ownership
    const existingCommunity = await Community.findById(req.params.id);
    if (!existingCommunity) return res.status(404).json({ message: 'Community not found' });

    if (existingCommunity.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can edit this community' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description exceeds 500 characters' });
    }
    if (rules && rules.length > 1000) {
      return res.status(400).json({ message: 'Rules exceed 1000 characters' });
    }

    const updateData = { description, rules, privacy };

    if (req.files?.['icon']) updateData.icon = req.files['icon'][0].path;
    if (req.files?.['banner']) updateData.banner = req.files['banner'][0].path;

    const community = await Community.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(community);
  } catch (err) {
    console.error('Community Update Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE community
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (community.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can delete this community' });
    }

    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: 'Community deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST join community
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST leave community
router.post('/:id/leave', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    community.members = community.members.filter(id => id.toString() !== userId);
    await community.save();
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
