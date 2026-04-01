const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Vui lòng nhập tên đăng nhập'],
    unique: true, // Đảm bảo không trùng lặp
    trim: true,
    lowercase: true
  },
  fullName: {
    type: String,
    required: [true, 'Vui lòng nhập họ và tên'],
    trim: true
  },
  // Mật khẩu chính để đăng nhập hằng ngày
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: 6,
    select: false // Khi dùng lệnh GET sẽ không hiện mật khẩu ra ngoài
  },
  // Mật khẩu bí mật - dùng để khôi phục khi quên mật khẩu chính
  secretPassword: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu bí mật'],
    select: false // Bảo mật tối đa
  }
}, { 
  timestamps: true // Tự động thêm createdAt và updatedAt
});
module.exports = mongoose.model('User', UserSchema);