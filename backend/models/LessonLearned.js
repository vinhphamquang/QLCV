const mongoose = require('mongoose');

const LessonLearnedSchema = new mongoose.Schema({
  // Công tác cần rút kinh nghiệm (Tên đầu việc, sự kiện, hoặc mảng công tác)
  workTitle: {
    type: String,
    required: [true, 'Vui lòng nhập tên công tác cần rút kinh nghiệm'],
    trim: true
  },

  // Nội dung cần rút kinh nghiệm (Chi tiết bài học, lỗi sai hoặc điểm cần sửa)
  experienceContent: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung rút kinh nghiệm'],
    trim: true
  },

  // Ghi chú
  notes: {
    type: String,
    trim: true
  },

  // Thời gian tạo (giúp theo dõi theo năm học/tháng)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LessonLearned', LessonLearnedSchema);