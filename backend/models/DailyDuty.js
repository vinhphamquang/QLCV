const mongoose = require('mongoose');

const DailyDutySchema = new mongoose.Schema({
  // Ngày tháng năm trực
  dutyDate: {
    type: Date,
    required: [true, 'Vui lòng chọn ngày trực'],
    default: Date.now
  },

  // Nội dung xét (Đánh giá, kiểm tra công việc trong ngày)
  evaluationContent: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung xét'],
    trim: true
  },

  // Ghi chú
  notes: {
    type: String,
    trim: true
  },

  // Thời gian tạo bản ghi
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyDuty', DailyDutySchema);