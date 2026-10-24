const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Material = require('../models/Material');
const { protect, authorize } = require('../middleware/auth');

// Faculty dashboard
router.get('/faculty', protect, authorize('faculty'), async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user.userId });
    const materials = await Material.find({ uploadedBy: req.user.userId })
      .populate('course', 'name subject');

    const totalDownloads = materials.reduce((sum, m) => sum + m.downloadCount, 0);
    const totalUseful = materials.reduce((sum, m) => sum + m.usefulCount, 0);

    // Add courseName to each material
    const materialsWithCourseName = materials.map(m => ({
      ...m.toObject(),
      courseName: m.course ? m.course.name : 'Unknown Course'
    }));

    res.status(200).json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalMaterials: materials.length,
        totalDownloads,
        totalUseful,
        courses,
        materials: materialsWithCourseName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Student dashboard
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    const courses = await Course.find();
    const materials = await Material.find()
      .populate('uploadedBy', 'name')
      .populate('course', 'name subject');

    // Add courseName to each material
    const materialsWithCourseName = materials.map(m => ({
      ...m.toObject(),
      courseName: m.course ? m.course.name : 'Unknown Course'
    }));

    res.status(200).json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalMaterials: materials.length,
        courses,
        materials: materialsWithCourseName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
