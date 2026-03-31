const mongoose = require('mongoose');

const weeklyTaskSchema = new mongoose.Schema({
  thu: {
    type: String,
    required: true,
    enum: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']
  },
  noiDungCongViec: {
    type: String,
    required: true
  },
  thoiGian: {
    type: Date,
    required: true
  },
  diaDiem: {
    type: String,
    default: ''
  },
  ghiChu: {
    type: String,
    default: ''
  },
  daHoanThanh: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeeklyTask', weeklyTaskSchema);
