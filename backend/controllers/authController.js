const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hàm tạo Token (dùng chung)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// [POST] Đăng ký (Dùng 1 lần để tạo acc cho thầy)
exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [POST] Đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, fullName: user.fullName });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] Quên mật khẩu - Dùng Secret Password
exports.forgotPassword = async (req, res) => {
  const { username, secretPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ username }).select('+secretPassword');
    if (!user || !(await user.matchSecretPassword(secretPassword))) {
      return res.status(401).json({ success: false, message: 'Mã bí mật không đúng!' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};