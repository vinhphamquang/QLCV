import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState('login'); 
  const [gatekeeperIntent, setGatekeeperIntent] = useState('register'); 
  const [showWarning, setShowWarning] = useState(false);
  
  // State quản lý bước của màn hình Quên mật khẩu (1: Nhập User, 2: Nhập Pass mới)
  const [forgotStep, setForgotStep] = useState(1);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '', 
    secretPassword: ''   
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ username: '', fullName: '', password: '', confirmPassword: '', secretPassword: '' });
  };

  const switchView = (view) => {
    setCurrentView(view);
    resetForm();
    setShowWarning(false);
    setForgotStep(1); // Reset lại bước khi chuyển trang
  };

  const openGatekeeper = (intent) => {
    setGatekeeperIntent(intent);
    setCurrentView('gatekeeper');
    resetForm();
  };

  // 1. XỬ LÝ ĐĂNG NHẬP
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username: formData.username,
        password: formData.password
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        onLoginSuccess();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
    }
  };

  // 2. XỬ LÝ GÁC CỔNG
  const handleGatekeeper = (e) => {
    e.preventDefault();
    if (!formData.secretPassword.trim()) {
      alert('Vui lòng nhập Mã bí mật hệ thống!');
      return;
    }
    setCurrentView(gatekeeperIntent); 
  };

  // 3. XỬ LÝ CHECK TÊN ĐĂNG NHẬP (QUÊN MẬT KHẨU BƯỚC 1)
  const handleCheckUsername = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      alert('Vui lòng nhập Tên đăng nhập!');
      return;
    }
    
    try {
      // GỌI API XUỐNG BACKEND ĐỂ KIỂM TRA XEM USERNAME NÀY CÓ TỒN TẠI KHÔNG
      const res = await axios.post('http://localhost:5000/api/auth/check-username', {
        username: formData.username
      });
      
      if (res.data.success) {
        setForgotStep(2); // Nếu tồn tại, mở bước 2 cho nhập Pass mới
      }
    } catch (err) {
      // Báo lỗi ngay lập tức nếu không tìm thấy
      alert(err.response?.data?.message || 'Tài khoản này không tồn tại trong hệ thống!');
    }
  };

  // 4. XỬ LÝ MỞ POPUP CẢNH BÁO ĐĂNG KÝ
  const handlePreRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    setShowWarning(true); 
  };

  // 5. CHỐT HẠ ĐĂNG KÝ
  const handleFinalRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password,
        secretPassword: formData.secretPassword 
      });
      if (res.data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập lại.');
        switchView('login'); 
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra!');
      setShowWarning(false);
    }
  };

  // 6. XỬ LÝ KHÔI PHỤC MẬT KHẨU (BƯỚC 2)
  const handleForgotPass = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        username: formData.username,
        secretPassword: formData.secretPassword, 
        newPassword: formData.password
      });
      if (res.data.success) {
        alert('Khôi phục thành công! Vui lòng dùng mật khẩu mới để đăng nhập.');
        switchView('login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Mã bí mật hoặc thao tác không đúng!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] font-sans p-4 relative">
      
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10">
        
        <div className="bg-[#2453c9] py-6 px-8 text-center">
          <h2 className="text-white text-2xl font-semibold tracking-wide uppercase">
            {currentView === 'login' && 'Đăng Nhập'}
            {currentView === 'gatekeeper' && 'Xác Nhận Nội Bộ'}
            {currentView === 'register' && 'Tạo Tài Khoản'}
            {currentView === 'forgot' && 'Khôi Phục Mật Khẩu'}
          </h2>
          <p className="text-blue-100 text-sm mt-1 font-light">Trường THCS Trần Phú</p>
        </div>

        <div className="p-8">
          
          {/* ==================== MÀN HÌNH ĐĂNG NHẬP ==================== */}
          {currentView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
                <input name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450] focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450] focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9]" />
              </div>
              <div className="text-right">
                <button type="button" onClick={() => openGatekeeper('forgot')} className="text-sm text-[#2453c9] hover:underline font-medium">Quên mật khẩu?</button>
              </div>
              <button type="submit" className="w-full bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-3 rounded mt-2">Vào Hệ Thống</button>
              <div className="text-center mt-4 text-sm text-gray-600">
                Giáo viên mới? <button type="button" onClick={() => openGatekeeper('register')} className="text-[#2453c9] font-medium hover:underline">Đăng ký ngay</button>
              </div>
            </form>
          )}

          {/* ==================== MÀN HÌNH GÁC CỔNG ==================== */}
          {currentView === 'gatekeeper' && (
            <form onSubmit={handleGatekeeper} className="space-y-4">
              <div className="bg-amber-50 text-amber-700 p-4 rounded text-sm mb-4 border border-amber-200">
                {gatekeeperIntent === 'register' 
                  ? 'Hệ thống chỉ dành cho giáo viên nội bộ. Vui lòng nhập Mã bí mật để tiếp tục tạo tài khoản.' 
                  : 'Vui lòng xuất trình Mã bí mật hệ thống để được cấp quyền khôi phục mật khẩu.'}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã bí mật hệ thống</label>
                <input name="secretPassword" type="password" value={formData.secretPassword} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450] focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9]" />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded mt-2">Xác Nhận Mã Bí Mật</button>
              <button type="button" onClick={() => switchView('login')} className="w-full text-gray-500 hover:text-gray-700 text-sm mt-3 font-medium">Trở về Đăng nhập</button>
            </form>
          )}

          {/* ==================== MÀN HÌNH FORM ĐĂNG KÝ ==================== */}
          {currentView === 'register' && (
            <form onSubmit={handlePreRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
                <input name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên giáo viên</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tạo mật khẩu</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận lại mật khẩu</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450]" />
              </div>
              <button type="submit" className="w-full bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-3 rounded mt-2">Hoàn Tất Đăng Ký</button>
              <button type="button" onClick={() => switchView('login')} className="w-full text-gray-500 hover:text-gray-700 text-sm mt-3 font-medium">Hủy bỏ</button>
            </form>
          )}

          {/* ==================== MÀN HÌNH KHÔI PHỤC MẬT KHẨU (2 BƯỚC) ==================== */}
          {currentView === 'forgot' && (
            <div>
              {/* BƯỚC 1: KIỂM TRA USERNAME */}
              {forgotStep === 1 && (
                <form onSubmit={handleCheckUsername} className="space-y-4">
                  <div className="bg-blue-50 text-blue-700 p-4 rounded text-sm mb-4 border border-blue-200">
                    Thầy/cô vui lòng nhập đúng <b>Tên đăng nhập</b> để hệ thống kiểm tra trước.
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập cần khôi phục</label>
                    <input name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450]" />
                  </div>
                  <button type="submit" className="w-full bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-3 rounded mt-2">Kiểm tra thông tin</button>
                  <button type="button" onClick={() => switchView('login')} className="w-full text-gray-500 hover:text-gray-700 text-sm mt-3 font-medium">Hủy bỏ</button>
                </form>
              )}

              {/* BƯỚC 2: NHẬP PASSWORD MỚI (Sau khi check Username Ok) */}
              {forgotStep === 2 && (
                <form onSubmit={handleForgotPass} className="space-y-4">
                  <div className="bg-green-50 text-green-700 p-4 rounded text-sm mb-4 border border-green-200 flex items-center gap-2">
                    <span className="text-xl">✅</span> Tìm thấy tài khoản: <b>{formData.username}</b>
                  </div>
                  
                  {/* Ô nhập username bị mờ đi để người dùng biết là đã fix */}
                  <div className="hidden">
                    <input name="username" value={formData.username} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tạo mật khẩu mới</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded text-base text-[#333] font-[450]" />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded mt-2">Xác nhận Đổi Mật Khẩu</button>
                  <button type="button" onClick={() => switchView('login')} className="w-full text-gray-500 hover:text-gray-700 text-sm mt-3 font-medium">Trở về Đăng nhập</button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ==================== MODAL CẢNH BÁO TRƯỚC KHI CHỐT ĐĂNG KÝ ==================== */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-red-50 p-6 border-b border-red-100 text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-xl font-bold text-red-700">Lưu Ý Cực Kỳ Quan Trọng</h3>
            </div>
            <div className="p-6 text-[#333] text-base leading-relaxed">
              <p className="mb-4">
                Tài khoản của thầy/cô sẽ được gắn kết vĩnh viễn với <b>Mã bí mật hệ thống</b> vừa nhập ở vòng ngoài.
              </p>
              <p className="mb-4">
                Đây là chìa khóa <b className="text-red-600">duy nhất</b> để lấy lại mật khẩu và <b className="text-red-600">không thể thay đổi</b>. Nếu quên mã này, thầy/cô sẽ vĩnh viễn không thể khôi phục tài khoản nếu mất mật khẩu.
              </p>
              <p className="font-medium text-center bg-gray-50 p-3 rounded border border-gray-200">
                Thầy/cô chắc chắn đã ghi nhớ mã bí mật này chứ?
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
              <button 
                onClick={() => setShowWarning(false)} 
                className="flex-1 py-2.5 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Hủy, tôi cần xem lại
              </button>
              <button 
                onClick={handleFinalRegister} 
                className="flex-1 py-2.5 bg-red-600 rounded text-white font-medium hover:bg-red-700 shadow-md shadow-red-200 transition-colors"
              >
                Đã nhớ & Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;