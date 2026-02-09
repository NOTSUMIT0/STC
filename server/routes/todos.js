import express from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/todos
// @desc    Get all active todos for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id, isDeleted: false }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/todos
// @desc    Create a todo
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      user: req.user.id
    });

    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/todos/:id
// @desc    Update todo (toggle complete)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ msg: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Update fields
    if (req.body.isCompleted !== undefined) {
      todo.isCompleted = req.body.isCompleted;
      todo.completedAt = req.body.isCompleted ? Date.now() : null;
    }

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/todos/:id
// @desc    Soft delete todo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ msg: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Soft delete
    todo.isDeleted = true;
    todo.deletedAt = Date.now();
    await todo.save();

    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/todos/analytics
// @desc    Get analytics for dashboard graphs
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();

    // 1. Monthly Completion (Bar Chart)
    // Get stats for the current month by day
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyStats = await Todo.aggregate([
      {
        $match: {
          user: userId,
          completedAt: { $gte: startOfMonth, $lte: endOfMonth },
          isCompleted: true
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$completedAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill in missing days
    const daysInMonth = endOfMonth.getDate();
    const fullMonthData = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayData = monthlyStats.find(d => d._id === i);
      fullMonthData.push({
        day: i,
        completed: dayData ? dayData.count : 0
      });
    }

    // 2. Weekly Analysis (Area/Line Chart)
    // Last 7 days: Created vs Completed vs Deleted
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyStats = await Todo.aggregate([
      {
        $match: {
          user: userId,
          $or: [
            { createdAt: { $gte: startOfWeek } },
            { completedAt: { $gte: startOfWeek } },
            { deletedAt: { $gte: startOfWeek } }
          ]
        }
      },
      {
        $project: {
          createdDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          completedDate: {
            $cond: [
              { $and: ["$isCompleted", { $gte: ["$completedAt", startOfWeek] }] },
              { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
              null
            ]
          },
          deletedDate: {
            $cond: [
              { $and: ["$isDeleted", { $gte: ["$deletedAt", startOfWeek] }] },
              { $dateToString: { format: "%Y-%m-%d", date: "$deletedAt" } },
              null
            ]
          }
        }
      },
      {
        $facet: {
          created: [
            { $group: { _id: "$createdDate", count: { $sum: 1 } } }
          ],
          completed: [
            { $match: { completedDate: { $ne: null } } },
            { $group: { _id: "$completedDate", count: { $sum: 1 } } }
          ],
          deleted: [
            { $match: { deletedDate: { $ne: null } } },
            { $group: { _id: "$deletedDate", count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    // Format weekly data
    const weeklyData = [];
    if (weeklyStats.length > 0) {
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        const createdCount = weeklyStats[0].created.find(x => x._id === dateStr)?.count || 0;
        const completedCount = weeklyStats[0].completed.find(x => x._id === dateStr)?.count || 0;
        const deletedCount = weeklyStats[0].deleted.find(x => x._id === dateStr)?.count || 0;

        weeklyData.push({
          date: dateStr,
          name: dayName,
          created: createdCount,
          completed: completedCount,
          deleted: deletedCount // Optional to show
        });
      }
    }

    res.json({
      monthlyData: fullMonthData,
      weeklyData: weeklyData
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
