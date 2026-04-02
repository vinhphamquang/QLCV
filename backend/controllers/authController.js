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

// [POST] Kiểm tra Username và Mã bí mật (Dùng cho Bước 1 Quên mật khẩu)
exports.verifyRecoveryInfo = async (req, res) => {
  const { username, secretPassword } = req.body;
  try {
    // Tìm user và lấy ra secretPassword (vì mặc định đang bị ẩn select: false)
    const user = await User.findOne({ username }).select('+secretPassword');
    
    // Nếu không có user, hoặc có mà sai mã bí mật -> Đá ra ngay
    if (!user || !(await user.matchSecretPassword(secretPassword))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Tài khoản hoặc Mã bí mật không đúng!' 
      });
    }
    
    // Nếu qua được ải trên tức là chuẩn 100% -> Báo OK để React mở Form đổi Pass
    res.status(200).json({ 
      success: true, 
      message: 'Xác minh thành công' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// [POST] Kiểm tra Mã bí mật hệ thống (Dùng để mở cổng Đăng ký)
exports.verifySystemSecret = async (req, res) => {
  const { secretPassword } = req.body;
  try {
    // Tìm tài khoản được tạo ĐẦU TIÊN trong hệ thống (Tài khoản gốc của trường)
    const adminUser = await User.findOne().sort({ createdAt: 1 }).select('+secretPassword');
    
    // Nếu DB trống trơn (Chưa có ai đăng ký bao giờ) -> Cho qua luôn để tạo tài khoản đầu tiên
    if (!adminUser) {
      return res.status(200).json({ 
        success: true, 
        message: 'Hệ thống mới, cho phép tạo tài khoản đầu tiên.' 
      });
    }

    // Nếu đã có tài khoản rồi, bắt buộc phải check mã bí mật với tài khoản gốc
    if (!(await adminUser.matchSecretPassword(secretPassword))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mã bí mật hệ thống không đúng, từ chối cấp quyền!' 
      });
    }
    
    // Mã chuẩn -> Báo OK
    res.status(200).json({ success: true, message: 'Đã xác minh mã bí mật hệ thống.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};