import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Trường THCS Trần Phú</h3>
          <p>Nơi ươm mầm tri thức, vun đắp tương lai</p>
        </div>
        
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>📍 Địa chỉ: TP. Trà Vinh, Tỉnh Trà Vinh</p>
          <p>📞 Điện thoại: (0294) xxx xxxx</p>
          <p>✉️ Email: thcstranphu@travinh.edu.vn</p>
        </div>
        
        <div className="footer-section">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/quan-ly-giao-vien">Quản lý giáo viên</a></li>
            <li><a href="/thong-bao">Thông báo</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Trường THCS Trần Phú. Phát triển bởi Thực tập sinh TVU.</p>
      </div>
    </footer>
  );
};

export default Footer;
