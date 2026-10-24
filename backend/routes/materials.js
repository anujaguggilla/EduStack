const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const Course = require('../models/Course');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middleware/auth');

// Create uploads folder if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Upload material (faculty)
router.post('/upload', protect, authorize('faculty'), upload.single('file'), async (req, res) => {
  try {
    const { fileName, fileType, subject, module, topic, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.faculty.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Calculate file size
    let fileSize = '0 MB';
    if (req.file) {
      const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(1);
      fileSize = sizeInMB + ' MB';
    } else {
      // For demo uploads without actual file
      fileSize = (Math.random() * 4 + 1).toFixed(1) + ' MB';
    }

    const material = await Material.create({
      fileName: fileName || (req.file ? req.file.originalname : 'Demo File'),
      fileType,
      subject,
      module,
      topic,
      course: courseId,
      uploadedBy: req.user.userId,
      filePath: req.file ? req.file.path : null,
      fileSize: fileSize,
    });

    course.materials.push(material._id);
    await course.save();

    res.status(201).json({ success: true, message: 'Material uploaded', data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all materials
router.get('/', protect, async (req, res) => {
  try {
    const { courseId, subject, module, topic } = req.query;
    let filter = {};
    if (courseId) filter.course = courseId;
    if (subject) filter.subject = subject;
    if (module) filter.module = module;
    if (topic) filter.topic = topic;

    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name email')
      .populate('course', 'name subject')
      .sort({ uploadDate: -1 });

    // Add courseName to each material for frontend compatibility
    const materialsWithCourseName = materials.map(m => ({
      ...m.toObject(),
      courseName: m.course ? m.course.name : 'Unknown Course'
    }));

    res.status(200).json({ success: true, data: materialsWithCourseName });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search materials
router.get('/search/:keyword', protect, async (req, res) => {
  try {
    const materials = await Material.find({
      $or: [
        { fileName: { $regex: req.params.keyword, $options: 'i' } },
        { subject: { $regex: req.params.keyword, $options: 'i' } },
        { topic: { $regex: req.params.keyword, $options: 'i' } },
      ],
    })
      .populate('uploadedBy', 'name')
      .populate('course', 'name');

    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Download material
router.put('/:id/download', protect, async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark as useful
router.put('/:id/useful', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    if (material.usefulMarks.includes(req.user.userId)) {
      material.usefulMarks = material.usefulMarks.filter(id => id.toString() !== req.user.userId);
      material.usefulCount -= 1;
    } else {
      material.usefulMarks.push(req.user.userId);
      material.usefulCount += 1;
    }

    await material.save();
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add feedback
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const { comment } = req.body;
    const user = await User.findById(req.user.userId);
    
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          feedback: { 
            student: req.user.userId,
            studentName: user.name,
            comment, 
            date: new Date() 
          } 
        } 
      },
      { new: true }
    );
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete material
router.delete('/:id', protect, authorize('faculty'), async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    if (material.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Course.findByIdAndUpdate(material.course, { $pull: { materials: material._id } });
    await Material.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update material (faculty)
router.put('/:id', protect, authorize('faculty'), async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    if (material.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
