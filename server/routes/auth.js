import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
import authenticate from '../middleware/auth.middleware.js';

// Get Current User
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Multer Config
import upload, { fileToBase64 } from '../middleware/upload.middleware.js';

// Update Profile
router.put('/me', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    const { firstName, lastName, bio, fieldOfStudy, university, hobbies, avatarType, avatarValue } = req.body;

    // ... (hobbies parsing logic remains same)

    let parsedHobbies = [];
    if (hobbies) {
      try {
        parsedHobbies = JSON.parse(hobbies);
      } catch (e) {
        parsedHobbies = hobbies.split(',').map(h => h.trim());
      }
    }

    const updateData = {
      firstName,
      lastName,
      bio,
      fieldOfStudy,
      university,
      hobbies: parsedHobbies,
      avatarType: avatarType || 'seed',
    };

    // If file uploaded, convert to Base64 and use as avatarValue
    if (req.file) {
      updateData.avatarType = 'upload';
      updateData.avatarValue = fileToBase64(req.file);
    } else if (avatarValue && avatarType === 'seed') {
      updateData.avatarValue = avatarValue;
    }

    // Only update avatar fields if provided/changed, otherwise keep existing
    // Actually, spreading works best if we construct the object carefully.
    // Let's rely on mongoose to ignore undefined if we didn't include them, 
    // but here we are extracting specific fields. 
    // If frontend sends all current data + changes, we are good.
    // If frontend sends only changes, we need to be careful with defaults overwriting.
    // Assuming frontend sends full state or we merge. Mongoose findByIdAndUpdate with new fields.

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true }).select('-password');
    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(`Signup attempt: ${email}`);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Signup failed: User already exists (${email})`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    console.log(`Signup successful: ${username} (${email})`);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    res.status(201).json({ user: { id: newUser._id, username, email } });
  } catch (error) {
    console.error(`Signup error: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found (${email})`);
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Invalid credentials (${email})`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    console.log(`Login successful: ${user.username} (${email})`);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site cookies on Render
      maxAge: 3600000 // 1 hour
    });

    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
