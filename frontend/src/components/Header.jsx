import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🏫 Hệ Thống Quản Lý Nhà Trường</h1>
        </Link>
        <nav className="nav">
          <div className="nav-left">
            <Link to="/" className="nav-link">🏠 Trang Chủ</Link>
            
            <Link to="/quan-ly-giao-vien" className="nav-link">👨‍🏫 Quản Lý Giáo Viên</Link>
            
            {/* Dropdown Kiểm Tra */}
            <div className="dropdown">
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown('kiemtra')}
              >
                📋 Công Tác Kiểm Tra ▼
              </button>
              {openDropdown === 'kiemtra' && (
                <div className="dropdown-menu">
                  <Link to="/kiem-tra-noi-bo" className="dropdown-item">📋 Kiểm Tra Nội Bộ</Link>
                  <Link to="/kiem-tra-cac-ky" className="dropdown-item">📝 Kiểm Tra Các Kỳ</Link>
                </div>
              )}
            </div>

            {/* Dropdown Công Việc */}
            <div className="dropdown">
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown('congviec')}
              >
                📅 Công Việc ▼
              </button>
              {openDropdown === 'congviec' && (
                <div className="dropdown-menu">
                  <Link to="/cong-viec-tuan" className="dropdown-item">📅 Công Việc Tuần</Link>
                  <Link to="/cong-viec-thang" className="dropdown-item">📆 Công Việc Tháng</Link>
                </div>
              )}
            </div>

            <Link to="/hoi-thi" className="nav-link">🏆 Hội Thi</Link>
            
            <a href="https://qlhsvp.onrender.com" className="nav-link" target="_blank" rel="noopener noreferrer">
              👨‍🎓 QL Học Sinh Vi Phạm
            </a>
            
            <Link to="/ra-de-kiem-tra" className="nav-link">📄 Ra Đề Kiểm Tra</Link>
          </div>

          <div className="nav-right">
            <Link to="/thong-bao" className="nav-link notification-link">
              🔔 Thông Báo
              <span className="notification-badge">!</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
