import express from 'express';
import upload from '../middleware/upload.middleware.js'; // Use Cloudinary middleware
import Resource from '../models/Resource.js';

const router = express.Router();
import auth from '../middleware/auth.middleware.js';

// GET all resources (User Isolated)
router.get('/', auth, async (req, res) => {
  try {
    const { parentId } = req.query;
    const query = {
      parentId: parentId || null,
      user: req.user.id // ISOLATION: Only fetch this user's resources
    };

    // If parentId is 'null' string (from query params), treat as null object
    if (parentId === 'null') query.parentId = null;

    const resources = await Resource.find(query).sort({ type: 1, createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create resource
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, type, description, url, tags, isPublic, parentId } = req.body;
    let resourceUrl = url;

    // If file uploaded, use Cloudinary URL
    if (req.file) {
      resourceUrl = req.file.path;
    }

    const newResource = new Resource({
      title,
      type, // 'link' or 'file' (or others)
      parentId: parentId === 'null' ? null : parentId,
      description,
      url: resourceUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      user: req.user.id, // ISOLATION: Attach authenticated user ID
      isPublic: isPublic === 'true',
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update resource
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { title, type, description, url, tags, isPublic } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    resource.title = title || resource.title;
    resource.type = type || resource.type;
    resource.description = description || resource.description;
    resource.isPublic = isPublic === 'true' ? true : (isPublic === 'false' ? false : resource.isPublic);

    if (tags) {
      resource.tags = tags.split(',').map(tag => tag.trim());
    }

    if (req.file) {
      resource.url = req.file.path;
    } else if (url) {
      resource.url = url;
    }

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE resource
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    await resource.deleteOne();
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
