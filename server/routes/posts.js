import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// Multer setup for images (reusing logic from resources if possible, but distinct here for clarity)
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/posts/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `post-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for images
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
});


// GET all posts (with optional community filter)
router.get('/', async (req, res) => {
  try {
    const { communityId } = req.query;
    let query = {};

    if (communityId) {
      query.community = communityId;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, title, content, communityId, authorName, authorAvatar } = req.body;

    // Parse options if it's a poll (multipart sends strings)
    let options = [];
    if (req.body.options) {
      try {
        options = JSON.parse(req.body.options);
      } catch (e) {
        options = [];
      }
    }

    const post = new Post({
      type: type || 'text',
      title,
      content,
      community: communityId || null,
      image: req.file ? `/uploads/posts/${req.file.filename}` : null,
      options,
      author: {
        username: authorName || 'Anonymous',
        avatarSeed: authorAvatar || 'Felix'
      },
    });

    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT like/upvote or dislike/downvote a post
router.put('/:id/like', async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'upvote' or 'downvote'
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Initialize arrays if missing
    if (!Array.isArray(post.likes)) post.likes = [];
    if (!Array.isArray(post.dislikes)) post.dislikes = [];

    const likeIndex = post.likes.indexOf(userId);
    const dislikeIndex = post.dislikes.indexOf(userId);

    if (action === 'upvote') {
      if (likeIndex === -1) {
        post.likes.push(userId);
        if (dislikeIndex !== -1) post.dislikes.splice(dislikeIndex, 1);
      } else {
        post.likes.splice(likeIndex, 1); // Toggle off
      }
    } else if (action === 'downvote') {
      if (dislikeIndex === -1) {
        post.dislikes.push(userId);
        if (likeIndex !== -1) post.likes.splice(likeIndex, 1);
      } else {
        post.dislikes.splice(dislikeIndex, 1); // Toggle off
      }
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT edit a post
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT vote on a poll
router.put('/:id/vote', async (req, res) => {
  const { optionIndex } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.type !== 'poll') return res.status(400).json({ message: 'Not a poll' });

    post.options[optionIndex].votes += 1;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
