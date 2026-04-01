import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    secretPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    
    try {
      const res = await axios.post(url, formData);
      if (res.data.success) {
        // Lưu Token vào LocalStorage để dùng cho các API sau
        localStorage.setItem('token', res.data.token);
        alert(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
        onLoginSuccess(); // Thông báo cho App là đã login
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>{isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ HỆ THỐNG'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Tên đăng nhập" onChange={handleChange} fullWidth style={styles.input} />
        
        {!isLogin && (
          <input name="fullName" placeholder="Họ và tên" onChange={handleChange} style={styles.input} />
        )}
        
        <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} style={styles.input} />
        
        {!isLogin && (
          <input name="secretPassword" type="password" placeholder="Mã bí mật (Để khôi phục)" onChange={handleChange} style={styles.input} />
        )}

        <button type="submit" style={styles.button}>
          {isLogin ? 'Vào hệ thống' : 'Tạo tài khoản'}
        </button>
      </form>
      
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue', textAlign: 'center' }}>
        {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
      </p>
    </div>
  );
};

const styles = {
  input: { display: 'block', width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }
};

export default Auth;