const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { project, status, assignedTo } = req.query;
    
    let query = {};
    
    // Filter by project if user is member
    if (project) {
      const projectDoc = await Project.findById(project);
      if (projectDoc) {
        const isMember = projectDoc.members.includes(req.user._id);
        if (isMember || req.user.role === 'admin') {
          query.project = project;
        }
      }
    } else {
      // Get tasks from all projects user is member of
      const userProjects = await Project.find({
        $or: [
          { owner: req.user._id },
          { members: req.user._id }
        ]
      }).select('_id');
      query.project = { $in: userProjects.map(p => p._id) };
    }

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name owner members')
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const isMember = project.members.includes(req.user._id);
    
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
});

// Create task
router.post('/', auth, [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Task title must be 3-200 characters'),
  body('project').isMongoId().withMessage('Valid project ID is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, assignedTo, priority, dueDate } = req.body;

    // Check if user is member of the project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = projectDoc.members.includes(req.user._id);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You must be a project member' });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'medium',
      dueDate
    });

    await task.save();
    await task.populate('project', 'name');
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// Update task
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Task title must be 3-200 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'overdue']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const isMember = project.members.includes(req.user._id);
    
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (priority) task.priority = priority;
    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
    }
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    await task.populate('project', 'name');
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// Assign task to user
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const isMember = project.members.includes(req.user._id);
    
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.assignedTo = userId;
    await task.save();
    await task.populate('project', 'name');
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.json(task);
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ message: 'Server error assigning task' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is creator or admin
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only creator can delete task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;
