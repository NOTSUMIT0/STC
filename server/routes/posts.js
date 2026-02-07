import express from 'express';
import Post from '../models/Post.js';
import Community from '../models/Community.js';

const router = express.Router();

// Multer setup for images (reusing logic from resources if possible, but distinct here for clarity)
import upload, { fileToBase64 } from '../middleware/upload.middleware.js';
import authenticate from '../middleware/auth.middleware.js';

// GET all posts (with filtering)
router.get('/', authenticate, async (req, res) => {
  try {
    const { communityId, filter, skip = 0 } = req.query;
    let query = {};

    if (communityId) {
      query.community = communityId;
    } else {
      // Home Feed: Only show posts from joined communities
      // If user has not joined any, we could show "Popular" or empty. 
      // User asked for "which community the student are in on home feed"
      const joinedCommunities = await Community.find({ members: req.user.id }).select('_id');
      const joinedIds = joinedCommunities.map(c => c._id);

      // If joined communities exist, filter by them. If none, maybe show all (or empty? Reddit shows empty/popular). 
      // Let's filter by joined if > 0, otherwise show nothing (force join) or show all? 
      // "on home feed the posts shows which community the student are in" implies strict filtering.
      if (joinedIds.length > 0) {
        query.community = { $in: joinedIds };
      } else {
        // Optional: Return empty if no communities joined, or return strictly nothing.
        // Let's return empty to encourage joining.
        return res.json([]);
      }
    }

    let sortOption = { createdAt: -1 }; // Default 'new'
    if (filter === 'top') sortOption = { likes: -1 };
    else if (filter === 'hot') sortOption = { likes: -1, createdAt: -1 }; // Simple heuristic

    const posts = await Post.find(query)
      .sort(sortOption)
      .limit(15) // Performance limit
      .populate('author', 'username avatarType avatarValue')
      .populate('community', 'name members creator'); // Need members and creator for permissions

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new post
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { type, title, content, communityId } = req.body;

    if (!communityId) return res.status(400).json({ message: 'Community ID is required' });

    // Check if user is member of the community
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (!community.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You must join the community to post.' });
    }

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
      community: communityId,
      image: req.file ? fileToBase64(req.file) : null,
      options,
      author: req.user.id,
    });

    const newPost = await post.save();
    // Populate author and community before returning
    await newPost.populate('author', 'username avatarType avatarValue');
    await newPost.populate('community', 'name members creator'); // Populating creator for frontend check

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
