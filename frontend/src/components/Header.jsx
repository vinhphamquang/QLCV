import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Quản Lý Nhà Trường</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Trang Chủ</Link>
          <Link to="/quan-ly-giao-vien" className="nav-link">Quản Lý Giáo Viên</Link>
          <Link to="/kiem-tra-noi-bo" className="nav-link">Kiểm Tra Nội Bộ</Link>
          <Link to="/kiem-tra-cac-ky" className="nav-link">Kiểm Tra Các Kỳ</Link>
          <Link to="/cong-viec-tuan" className="nav-link">Công Việc Tuần</Link>
          <Link to="/cong-viec-thang" className="nav-link">Công Việc Tháng</Link>
          <Link to="/hoi-thi" className="nav-link">Hội Thi</Link>
          <a href="https://qlhsvp.onrender.com" className="nav-link" target="_blank" rel="noopener noreferrer">
            Quản Lý Học Sinh Vi Phạm
          </a>
          <Link to="/ra-de-kiem-tra" className="nav-link">Ra Đề Kiểm Tra</Link>
          <Link to="/thong-bao" className="nav-link">Thông Báo</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
