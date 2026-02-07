import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Resource from '../models/Resource.js';

const router = express.Router();

// -- Multer Config --
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Unique filename: fieldname-timestamp.ext
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Documents only (PDF, DOC, DOCX, TXT)!'));
    }
  },
});

// -- Routes --

// GET all resources
router.get('/', async (req, res) => {
  try {
    const { parentId } = req.query;
    const query = { parentId: parentId || null }; // If parentId is missing/null, fetch root. 

    // If parentId is 'null' string (from query params), treat as null object
    if (parentId === 'null') query.parentId = null;

    const resources = await Resource.find(query).sort({ type: 1, createdAt: -1 }); // Folders first (if 'folder' < 'link' alphabetically? No, 'f' comes before 'l'. We might need better sort)
    // Actually 'folder' comes before 'link'. So sorting by type: 1 puts folders first.
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create resource
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, type, description, url, tags, user, isPublic, parentId } = req.body;
    let resourceUrl = url;

    // If file uploaded, use file path as URL
    if (req.file) {
      // We'll store the relative path. Ensure server serves 'uploads' statically.
      resourceUrl = `/uploads/${req.file.filename}`;
    }

    const newResource = new Resource({
      title,
      type, // 'link' or 'file' (or others)
      parentId: parentId === 'null' ? null : parentId,
      description,
      url: resourceUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      user: user || 'Anonymous', // Ideally from auth middleware
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
      resource.url = `/uploads/${req.file.filename}`;
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
