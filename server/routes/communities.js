import express from 'express';
import Community from '../models/Community.js';

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
    const { userId } = req.query; // Ideally from auth middleware
    if (!userId) return res.json([]);

    const communities = await Community.find({ members: userId });
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create community
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, userId, rules, privacy } = req.body;

    const existing = await Community.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Community name already taken' });

    const newCommunity = new Community({
      name,
      description,
      rules,
      privacy,
      icon,
      creator: userId,
      members: [userId], // Creator auto-joins
    });

    const saved = await newCommunity.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
