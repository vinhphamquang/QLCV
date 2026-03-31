const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  mon: {
    type: String,
    required: true,
    trim: true
  },
  ngay: {
    type: Date,
    required: true
  },
  noiDungConHanChe: {
    type: String,
    default: ''
  },
  rutKinhNghiem: {
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

module.exports = mongoose.model('Notification', notificationSchema);
