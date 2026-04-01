const mongoose = require('mongoose');

const TimetableChangeSchema = new mongoose.Schema({
  // Tuần ghi nhận thay đổi
  week: {
    type: Number,
    required: [true, 'Vui lòng nhập tuần'],
    min: 1,
    max: 52
  },

  // Môn học có sự thay đổi
  subject: {
    type: String,
    required: [true, 'Vui lòng nhập môn học thay đổi'],
    trim: true
  },

  // Tuần bắt đầu áp dụng thời khóa biểu mới
  applyWeek: {
    type: Number,
    required: [true, 'Vui lòng nhập tuần áp dụng'],
    min: 1
  },

  // Tuần kết thúc (nếu có)
  endWeek: {
    type: Number,
    required: [true, 'Vui lòng nhập tuần kết thúc'],
    validate: {
      validator: function(v) {
        return v >= this.applyWeek;
      },
      message: 'Tuần kết thúc phải lớn hơn hoặc bằng tuần áp dụng'
    }
  },

  // Thời gian thông báo cho giáo viên/học sinh
  notificationDate: {
    type: Date,
    required: [true, 'Vui lòng nhập thời gian thông báo']
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

module.exports = mongoose.model('TimetableChange', TimetableChangeSchema);