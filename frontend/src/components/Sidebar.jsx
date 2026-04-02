import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Sidebar.css';

function Sidebar({ onLogout }) { // <-- Nhận prop onLogout từ App.jsx truyền xuống
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (query.includes('kiểm tra') || query.includes('kiem tra')) {
        setOpenMenu('kiemtra');
      } else if (query.includes('công việc') || query.includes('cong viec') || query.includes('tuần') || query.includes('tháng')) {
        setOpenMenu('congviec');
      }
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setOpenMenu(null);
    }
  }, [searchQuery]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const highlightText = (text) => {
    if (!searchQuery.trim()) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <img src="/logo.png" alt="Logo Trường THCS Trần Phú" className="sidebar-logo-img" />
          <h2>Quản Lý Trường</h2>
        </Link>
      </div>

      <form className="sidebar-search" onSubmit={handleSearch}>
        <input
          type="text"
          className="sidebar-search-input"
          placeholder="🔍 Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Bao bọc nav trong một thẻ div có flex-grow để đẩy nút Đăng xuất xuống đáy */}
      <div className="sidebar-nav-container" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto' }}>
        <nav className="sidebar-nav">
          <Link to="/" className={`sidebar-item ${isActive('/')} ${highlightText('Trang Chủ') ? 'highlight' : ''}`}>
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-text">Trang Chủ</span>
          </Link>

          <Link to="/quan-ly-giao-vien" className={`sidebar-item ${isActive('/quan-ly-giao-vien')} ${highlightText('Quản Lý Giáo Viên') ? 'highlight' : ''}`}>
            <span className="sidebar-icon">👨‍🏫</span>
            <span className="sidebar-text">Quản Lý Giáo Viên</span>
          </Link>

          {/* Công Tác Kiểm Tra */}
          <div className="sidebar-group">
            <button
              className={`sidebar-item ${openMenu === 'kiemtra' ? 'open' : ''} ${highlightText('Công Tác Kiểm Tra') ? 'highlight' : ''}`}
              onClick={() => toggleMenu('kiemtra')}
            >
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-text">Công Tác Kiểm Tra</span>
              <span className="sidebar-arrow">{openMenu === 'kiemtra' ? '▼' : '▶'}</span>
            </button>
            {openMenu === 'kiemtra' && (
              <div className="sidebar-submenu">
                {/* Đổi Icon Kiểm tra nội bộ thành 📊 */}
                <Link to="/kiem-tra-noi-bo" className={`sidebar-subitem ${isActive('/kiem-tra-noi-bo')} ${highlightText('Kiểm Tra Nội Bộ') ? 'highlight' : ''}`}>
                  <span className="sidebar-icon">📊</span>
                  <span className="sidebar-text">Kiểm Tra Nội Bộ</span>
                </Link>
                <Link to="/kiem-tra-cac-ky" className={`sidebar-subitem ${isActive('/kiem-tra-cac-ky')} ${highlightText('Kiểm Tra Các Kỳ') ? 'highlight' : ''}`}>
                  <span className="sidebar-icon">📝</span>
                  <span className="sidebar-text">Kiểm Tra Các Kỳ</span>
                </Link>
              </div>
            )}
          </div>

          {/* Công Việc */}
          <div className="sidebar-group">
            <button
              className={`sidebar-item ${openMenu === 'congviec' ? 'open' : ''} ${highlightText('Công Việc') ? 'highlight' : ''}`}
              onClick={() => toggleMenu('congviec')}
            >
              <span className="sidebar-icon">📅</span>
              <span className="sidebar-text">Công Việc</span>
              <span className="sidebar-arrow">{openMenu === 'congviec' ? '▼' : '▶'}</span>
            </button>
            {openMenu === 'congviec' && (
              <div className="sidebar-submenu">
                <Link to="/cong-viec-tuan" className={`sidebar-subitem ${isActive('/cong-viec-tuan')} ${highlightText('Công Việc Tuần') || highlightText('tuần') ? 'highlight' : ''}`}>
                  <span className="sidebar-icon">📅</span>
                  <span className="sidebar-text">Công Việc Tuần</span>
                </Link>
                <Link to="/cong-viec-thang" className={`sidebar-subitem ${isActive('/cong-viec-thang')} ${highlightText('Công Việc Tháng') || highlightText('tháng') ? 'highlight' : ''}`}>
                  <span className="sidebar-icon">📆</span>
                  <span className="sidebar-text">Công Việc Tháng</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/hoi-thi" className={`sidebar-item ${isActive('/hoi-thi')} ${highlightText('Hội Thi') ? 'highlight' : ''}`}>
            <span className="sidebar-icon">🏆</span>
            <span className="sidebar-text">Hội Thi</span>
          </Link>

          <a href="https://qlhsvp.onrender.com" className={`sidebar-item ${highlightText('Học Sinh Vi Phạm') || highlightText('học sinh') ? 'highlight' : ''}`} target="_blank" rel="noopener noreferrer">
            <span className="sidebar-icon">👨‍🎓</span>
            <span className="sidebar-text">QL Học Sinh Vi Phạm</span>
          </a>

          <Link to="/ra-de-kiem-tra" className={`sidebar-item ${isActive('/ra-de-kiem-tra')} ${highlightText('Ra Đề') || highlightText('đề') ? 'highlight' : ''}`}>
            <span className="sidebar-icon">📄</span>
            <span className="sidebar-text">Ra Đề Kiểm Tra</span>
          </Link>

          {/* Sửa lại isActive, icon 📚 và highlightText cho Phân môn số tiết */}
          <Link to="/phan-mon-so-tiet" className={`sidebar-item ${isActive('/phan-mon-so-tiet')} ${highlightText('Phân môn') || highlightText('số tiết') ? 'highlight' : ''}`}>
            <span className="sidebar-icon">📚</span>
            <span className="sidebar-text">Phân môn số tiết</span>
          </Link>

          <Link to="/quan-ly-truc-ngay" className={`sidebar-item ${isActive('/phan-mon-so-tiet')} ${highlightText('Phân môn') || highlightText('số tiết') ? 'highlight' : ''}`}>
            <span className="sidebar-icon">📚</span>
            <span className="sidebar-text">Quản lý trực ngày</span>
          </Link>

          <Link to="/thong-bao" className={`sidebar-item ${isActive('/thong-bao')} ${highlightText('Thông Báo') ? 'highlight' : ''}`}>
            <span className="sidebar-icon">🔔</span>
            <span className="sidebar-text">Thông Báo</span>
            <span className="notification-dot"></span>
          </Link>
        </nav>

        {/* NÚT ĐĂNG XUẤT ĐƯỢC ĐẨY XUỐNG DƯỚI CÙNG */}
        <div className="sidebar-footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
          <button
            className="sidebar-item logout-btn"
            onClick={onLogout}
            style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#ff4d4f' }}
          >
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-text" style={{ fontWeight: 'bold' }}>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;