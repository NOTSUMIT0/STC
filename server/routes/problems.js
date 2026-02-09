import express from 'express';
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/problems
// @desc    Get all problems for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const problems = await Problem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/problems
// @desc    Create a new problem
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, difficulty, topic, link } = req.body;

    const newProblem = new Problem({
      user: req.user.id,
      title,
      difficulty,
      topic,
      link,
      status: 'Pending'
    });

    const problem = await newProblem.save();
    res.json(problem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/problems/:id/status
// @desc    Update problem status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    let problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ msg: 'Problem not found' });
    if (problem.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    problem.status = status;
    await problem.save();

    res.json(problem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/problems/:id
// @desc    Delete a problem
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ msg: 'Problem not found' });
    if (problem.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Problem.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Problem removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/problems/stats
// @desc    Get problem statistics for pie chart
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Group by status
    const stats = await Problem.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format for frontend (ensure all statuses are represented optionally, or just return what exists)
    // Common statuses: Pending, In Progress, Completed
    const formattedStats = [
      { name: 'Completed', value: 0, color: '#4ade80' }, // green-400
      { name: 'In Progress', value: 0, color: '#fbbf24' }, // amber-400
      { name: 'Pending', value: 0, color: '#f87171' }, // red-400
    ];

    stats.forEach(s => {
      const idx = formattedStats.findIndex(fs => fs.name === s._id);
      if (idx !== -1) {
        formattedStats[idx].value = s.count;
      }
    });

    // Calculate total for percentage if needed (frontend can do this)

    res.json(formattedStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
