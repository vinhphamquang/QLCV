const mongoose = require('mongoose');

const examInspectionSchema = new mongoose.Schema({
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
