const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  thang: {
    type: String,
    required: true
  },
  tenGiaoVien: {
    type: String,
    required: true,
    trim: true
  },
  noiDungKiemTra: {
    type: String,
    required: true
  },
  tietKiemTra: {
    type: String,
    required: true
  },
  thoiGianKiemTra: {
    type: Date,
    required: true
  },
  danhGia: {
    type: String,
    default: ''
  },
  rutKinhNghiem: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inspection', inspectionSchema);
