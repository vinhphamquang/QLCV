const mongoose = require('mongoose');

const TimetableChangeSchema = new mongoose.Schema({
  week: { type: Number, required: [true, 'Vui lòng nhập tuần'], min: 1, max: 52 },
  subject: { type: String, required: [true, 'Vui lòng nhập môn học thay đổi'], trim: true },
  applyWeek: { type: Number, required: [true, 'Vui lòng nhập tuần áp dụng'], min: 1 },
  endWeek: { type: Number, required: [true, 'Vui lòng nhập tuần kết thúc'] }, // ĐÃ BỎ VALIDATE BỊ LỖI
  notificationDate: { type: Date, required: [true, 'Vui lòng nhập thời gian thông báo'] },
  notes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TimetableChange', TimetableChangeSchema);