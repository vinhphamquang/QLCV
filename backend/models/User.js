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

// ==========================================
// 1. MÃ HÓA MẬT KHẨU TRƯỚC KHI LƯU VÀO DB
// ==========================================
UserSchema.pre('save', async function(next) {
  // Nếu cả 2 mật khẩu đều không bị thay đổi thì bỏ qua (dùng khi update info)
  if (!this.isModified('password') && !this.isModified('secretPassword')) {
    return next();
  }

  // Tạo "muối" (độ phức tạp 10 là chuẩn mực an toàn hiện tại)
  const salt = await bcrypt.genSalt(10);

  // Nếu mật khẩu chính bị thay đổi -> Băm nó ra
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Nếu mật khẩu bí mật bị thay đổi -> Băm nó ra luôn
  if (this.isModified('secretPassword')) {
    this.secretPassword = await bcrypt.hash(this.secretPassword, salt);
  }
  
  next();
});

// ==========================================
// 2. HÀM KIỂM TRA MẬT KHẨU KHI ĐĂNG NHẬP
// ==========================================
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // So sánh mật khẩu trần user nhập vào với mã băm trong DB
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// 3. HÀM KIỂM TRA MÃ BÍ MẬT KHI KHÔI PHỤC
// ==========================================
UserSchema.methods.matchSecretPassword = async function(enteredSecret) {
  // So sánh mã bí mật trần với mã băm trong DB
  return await bcrypt.compare(enteredSecret, this.secretPassword);
};

module.exports = mongoose.model('User', UserSchema);