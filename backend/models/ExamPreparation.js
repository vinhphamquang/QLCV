const mongoose = require('mongoose');

const examPreparationSchema = new mongoose.Schema({
  mon: {
    type: String,
    required: true
  },
  ngayNop: {
    type: Date,
    required: true
  },
  nguoiNop: {
    type: String,
    required: true,
    trim: true
  },
  nguoiRaDe: {
    type: String,
    required: true,
    trim: true
  },
  thoiGianLamBai: {
    type: String,
    required: true
  },
  tot: {
    type: Boolean,
    default: true
  },
  noiDungLoi: {
    type: String,
    default: ''
  },
  ghiChu: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExamPreparation', examPreparationSchema);
