const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  courseId: String,
  solved: { type: Boolean, default: false },
  solution: { type: String, default: '' },
});

module.exports = mongoose.model('Assignment', assignmentSchema);