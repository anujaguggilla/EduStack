const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// Get all courses
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'name email');
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create course (faculty only)
router.post('/', protect, authorize('faculty'), async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide course name and subject' 
      });
    }

    const course = await Course.create({
      name,
      subject,
      description,
      faculty: req.user.userId,
    });

    res.status(201).json({ 
      success: true,
      message: 'Course created successfully',
      data: course 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's courses (faculty)
router.get('/my-courses', protect, authorize('faculty'), async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user.userId });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update course (faculty only)
router.put('/:id', protect, authorize('faculty'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.faculty.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete course (faculty only)
router.delete('/:id', protect, authorize('faculty'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.faculty.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
