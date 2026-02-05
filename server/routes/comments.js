import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

// GET comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 }); // Oldest first usually better for conversations, or -1 for newest
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new comment
router.post('/', async (req, res) => {
  try {
    const { postId, content, parentCommentId, authorName, authorAvatar } = req.body;

    const comment = new Comment({
      post: postId,
      content,
      parentComment: parentCommentId || null,
      author: {
        username: authorName || 'Anonymous',
        avatarSeed: authorAvatar || 'Felix',
      },
    });

    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT like a comment
router.put('/:id/like', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.likes += 1;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
