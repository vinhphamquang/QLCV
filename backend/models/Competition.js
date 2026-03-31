const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  tenHoiThi: {
    type: String,
    required: true,
    trim: true
  },
  giaoViec: {
    type: String,
    required: true
  },
  thoiGianHoanThanh: {
    type: Date,
    required: true
  },
  thoiGianThamGiaCacCap: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Competition', competitionSchema);
