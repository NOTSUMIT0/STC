import express from 'express';
import Community from '../models/Community.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const p = 'uploads/communities/';
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
      cb(null, p);
    },
    filename: (req, file, cb) => cb(null, `comm-${Date.now()}${path.extname(file.originalname)}`)
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Images only!'));
  }
});

// GET all communities (or search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }
    const communities = await Community.find(query)
      .populate('members', 'username') // simplified population
      .sort({ members: -1 }); // Sort by popularity
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my communities (joined by user)
router.get('/my', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json([]);

    const communities = await Community.find({ members: userId });
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create community
router.post('/', upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, description, userId, rules, privacy } = req.body;

    const existing = await Community.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Community name already taken' });

    let iconPath = req.body.icon; // Could be Dicebear string from frontend
    if (req.files['icon']) iconPath = `/uploads/communities/${req.files['icon'][0].filename}`;

    let bannerPath = null;
    if (req.files['banner']) bannerPath = `/uploads/communities/${req.files['banner'][0].filename}`;

    const newCommunity = new Community({
      name,
      description,
      rules,
      privacy,
      icon: iconPath || 'stc-community', // Fallback or Dicebear seed
      banner: bannerPath,
      creator: userId,
      members: [userId],
    });

    const saved = await newCommunity.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update community
router.put('/:id', upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), async (req, res) => {
  try {
    const { description, rules, privacy } = req.body;
    const updateData = { description, rules, privacy };

    if (req.files['icon']) updateData.icon = `/uploads/communities/${req.files['icon'][0].filename}`;
    if (req.files['banner']) updateData.banner = `/uploads/communities/${req.files['banner'][0].filename}`;

    const community = await Community.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE community
router.delete('/:id', async (req, res) => {
  try {
    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: 'Community deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST join community
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
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
router.post('/:id/leave', async (req, res) => {
  try {
    const { userId } = req.body;
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
