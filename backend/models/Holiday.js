const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  // Nội dung ngày nghỉ (Ví dụ: Nghỉ Tết Nguyên Đán, Nghỉ lễ 30/4 - 1/5...)
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung ngày nghỉ'],
    trim: true
  },

  // Số ngày nghỉ
  daysCount: {
    type: Number,
    required: [true, 'Vui lòng nhập số ngày nghỉ'],
    min: [1, 'Số ngày nghỉ tối thiểu là 1']
  },

  // Ghi chú (Ví dụ: Nghỉ bù vào thứ Hai, hoặc các lưu ý trực trường)
  notes: {
    type: String,
    trim: true
  },

  // Ngày tạo bản ghi
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Holiday', HolidaySchema);