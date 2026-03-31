const mongoose = require('mongoose');

const monthlyTaskSchema = new mongoose.Schema({
  tuan: {
    type: String,
    required: true,
    enum: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5']
  },
  thu: {
    type: String,
    required: true,
    enum: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']
  },
  noiDung: {
    type: String,
    required: true
  },
  thoiGian: {
    type: Date,
    required: true
  },
  giaoViec: {
    type: String,
    required: true
  },
  ghiChu: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MonthlyTask', monthlyTaskSchema);
