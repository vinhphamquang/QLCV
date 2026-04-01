const mongoose = require('mongoose');

const KeyActivitySchema = new mongoose.Schema({
  // Tháng diễn ra (1-12)
  month: {
    type: Number,
    required: [true, 'Vui lòng nhập tháng'],
    min: 1,
    max: 12
  },

  // Danh sách các ngày cụ thể (Lưu dạng mảng để chọn được nhiều ngày)
  specificDates: [{
    type: Date,
    required: [true, 'Vui lòng nhập ít nhất một ngày cụ thể']
  }],

  // Bộ phận chịu trách nhiệm chính
  responsibleDept: {
    type: String,
    required: [true, 'Vui lòng nhập bộ phận chịu trách nhiệm'],
    trim: true
  },

  // Bộ phận phối hợp
  coordinatingDept: {
    type: String,
    trim: true
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

module.exports = mongoose.model('KeyActivity', KeyActivitySchema);