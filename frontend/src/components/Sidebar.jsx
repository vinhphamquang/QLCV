import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <h2>🏫 Quản Lý Trường</h2>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-item ${isActive('/')}`}>
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-text">Trang Chủ</span>
        </Link>

        <Link to="/quan-ly-giao-vien" className={`sidebar-item ${isActive('/quan-ly-giao-vien')}`}>
          <span className="sidebar-icon">👨‍🏫</span>
          <span className="sidebar-text">Quản Lý Giáo Viên</span>
        </Link>

        {/* Công Tác Kiểm Tra */}
        <div className="sidebar-group">
          <button 
            className={`sidebar-item ${openMenu === 'kiemtra' ? 'open' : ''}`}
            onClick={() => toggleMenu('kiemtra')}
          >
            <span className="sidebar-icon">📋</span>
            <span className="sidebar-text">Công Tác Kiểm Tra</span>
            <span className="sidebar-arrow">{openMenu === 'kiemtra' ? '▼' : '▶'}</span>
          </button>
          {openMenu === 'kiemtra' && (
            <div className="sidebar-submenu">
              <Link to="/kiem-tra-noi-bo" className={`sidebar-subitem ${isActive('/kiem-tra-noi-bo')}`}>
                <span className="sidebar-icon">📋</span>
                <span className="sidebar-text">Kiểm Tra Nội Bộ</span>
              </Link>
              <Link to="/kiem-tra-cac-ky" className={`sidebar-subitem ${isActive('/kiem-tra-cac-ky')}`}>
                <span className="sidebar-icon">📝</span>
                <span className="sidebar-text">Kiểm Tra Các Kỳ</span>
              </Link>
            </div>
          )}
        </div>

        {/* Công Việc */}
        <div className="sidebar-group">
          <button 
            className={`sidebar-item ${openMenu === 'congviec' ? 'open' : ''}`}
            onClick={() => toggleMenu('congviec')}
          >
            <span className="sidebar-icon">📅</span>
            <span className="sidebar-text">Công Việc</span>
            <span className="sidebar-arrow">{openMenu === 'congviec' ? '▼' : '▶'}</span>
          </button>
          {openMenu === 'congviec' && (
            <div className="sidebar-submenu">
              <Link to="/cong-viec-tuan" className={`sidebar-subitem ${isActive('/cong-viec-tuan')}`}>
                <span className="sidebar-icon">📅</span>
                <span className="sidebar-text">Công Việc Tuần</span>
              </Link>
              <Link to="/cong-viec-thang" className={`sidebar-subitem ${isActive('/cong-viec-thang')}`}>
                <span className="sidebar-icon">📆</span>
                <span className="sidebar-text">Công Việc Tháng</span>
              </Link>
            </div>
          )}
        </div>

        <Link to="/hoi-thi" className={`sidebar-item ${isActive('/hoi-thi')}`}>
          <span className="sidebar-icon">🏆</span>
          <span className="sidebar-text">Hội Thi</span>
        </Link>

        <a href="https://qlhsvp.onrender.com" className="sidebar-item" target="_blank" rel="noopener noreferrer">
          <span className="sidebar-icon">👨‍🎓</span>
          <span className="sidebar-text">QL Học Sinh Vi Phạm</span>
        </a>

        <Link to="/ra-de-kiem-tra" className={`sidebar-item ${isActive('/ra-de-kiem-tra')}`}>
          <span className="sidebar-icon">📄</span>
          <span className="sidebar-text">Ra Đề Kiểm Tra</span>
        </Link>

        <Link to="/thong-bao" className={`sidebar-item ${isActive('/thong-bao')}`}>
          <span className="sidebar-icon">🔔</span>
          <span className="sidebar-text">Thông Báo</span>
          <span className="notification-dot"></span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
