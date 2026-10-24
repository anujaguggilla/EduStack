const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: [true, 'Please provide a file name'],
  },
  fileType: {
    type: String,
    enum: ['PDF', 'PPT', 'DOC', 'ZIP'],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: String,
  fileSize: String,
  downloadCount: {
    type: Number,
    default: 0,
  },
  usefulCount: {
    type: Number,
    default: 0,
  },
  usefulMarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  feedback: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    studentName: String,
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Material', materialSchema);
