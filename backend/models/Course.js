const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a course name'],
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
  },
  description: {
    type: String,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  materials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
