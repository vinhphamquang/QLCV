const mongoose = require('mongoose');

const ExamCheckSchema = new mongoose.Schema({
  // Môn học (Ví dụ: Toán, Văn, Anh...)
  subject: {
    type: String,
    required: [true, 'Vui lòng nhập tên môn học'],
    trim: true
  },
  
  // Ngày kiểm tra/Ngày đánh giá
  examDate: {
    type: Date,
    required: [true, 'Vui lòng chọn ngày'],
    default: Date.now
  },

  // Nội dung còn hạn chế
  limitations: {
    type: String,
    trim: true
  },

  // Rút kinh nghiệm (Các bài học sau kỳ kiểm tra)
  experience: {
    type: String,
    trim: true
  },

  // Ghi chú thêm
  notes: {
    type: String,
    trim: true
  },

  // Thời gian tạo bản ghi (tự động)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExamCheck', ExamCheckSchema);