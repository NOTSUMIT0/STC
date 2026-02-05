import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new post
router.post('/', async (req, res) => {
  const post = new Post({
    type: req.body.type,
    title: req.body.title,
    content: req.body.content,
    options: req.body.options, // Expecting array of objects { text: "Option 1" }
    author: req.body.author || { username: 'Anonymous', avatarSeed: 'Felix' }, // Fallback for now
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT like a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes += 1;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT vote on a poll
router.put('/:id/vote', async (req, res) => {
  const { optionIndex } = req.body; // Expecting index of the option
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.type !== 'poll') return res.status(400).json({ message: 'Not a poll' });
    if (!post.options[optionIndex]) return res.status(400).json({ message: 'Invalid option' });

    post.options[optionIndex].votes += 1;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
