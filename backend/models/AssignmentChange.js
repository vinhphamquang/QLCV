const mongoose = require('mongoose');

const AssignmentChangeSchema = new mongoose.Schema({
  // Môn học
  subject: {
    type: String,
    required: [true, 'Vui lòng nhập tên môn học'],
    trim: true
  },

  // Số tiết (thay đổi)
  lessonCount: {
    type: Number,
    required: [true, 'Vui lòng nhập số tiết'],
    min: [0, 'Số tiết không được nhỏ hơn 0']
  },

  // Tuần bắt đầu áp dụng thay đổi
  startWeek: {
    type: Number,
    required: [true, 'Vui lòng nhập tuần bắt đầu'],
    min: [1, 'Tuần bắt đầu tối thiểu là 1'],
    max: [52, 'Tuần không quá 52']
  },

  // Tuần kết thúc áp dụng thay đổi
  endWeek: {
    type: Number,
    required: [true, 'Vui lòng nhập tuần kết thúc']
  },

  // Ghi chú
  notes: {
    type: String,
    trim: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AssignmentChange', AssignmentChangeSchema);