const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    required: true,
    trim: true
  },
  noiDungViPham: {
    type: String,
    default: ''
  },
  noiDungTuyenDuong: {
    type: String,
    default: ''
  },
  ngayVang: {
    type: Date,
    default: null
  },
  ngayNhap: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
