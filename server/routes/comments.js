import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

import authenticate from '../middleware/auth.middleware.js';

// GET comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .populate('author', 'username avatarType avatarValue');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new comment
router.post('/', authenticate, async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    const comment = new Comment({
      post: postId,
      content,
      parentComment: parentCommentId || null,
      author: req.user.id,
    });

    const newComment = await comment.save();
    await newComment.populate('author', 'username avatarType avatarValue');

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT like/upvote or dislike/downvote a comment
router.put('/:id/like', async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'upvote' or 'downvote'
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (!Array.isArray(comment.likes)) comment.likes = [];
    if (!Array.isArray(comment.dislikes)) comment.dislikes = [];

    const likeIndex = comment.likes.indexOf(userId);
    const dislikeIndex = comment.dislikes.indexOf(userId);

    if (action === 'upvote') {
      if (likeIndex === -1) {
        comment.likes.push(userId);
        if (dislikeIndex !== -1) comment.dislikes.splice(dislikeIndex, 1);
      } else {
        comment.likes.splice(likeIndex, 1); // Toggle off
      }
    } else if (action === 'downvote') {
      if (dislikeIndex === -1) {
        comment.dislikes.push(userId);
        if (likeIndex !== -1) comment.likes.splice(likeIndex, 1);
      } else {
        comment.dislikes.splice(dislikeIndex, 1); // Toggle off
      }
    }
    // Fallback for legacy "like" toggle if no action specified (backward compatibility if needed, else redundant)
    else if (!action && userId) {
      if (likeIndex === -1) comment.likes.push(userId);
      else comment.likes.splice(likeIndex, 1);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
