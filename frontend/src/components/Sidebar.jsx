import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ==========================================
// TẬP HỢP ICON CHUYÊN NGHIỆP (SVG)
// ==========================================
const Icons = {
  Home: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Bell: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Users: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  ClipboardCheck: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  ChartBar: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  FileText: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Calendar: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Trophy: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  ShieldAlert: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  BookOpen: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  ShieldCheck: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  CalendarClock: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Coffee: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 8h-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v-3h2a4 4 0 004-4V12a4 4 0 00-4-4zM6 5h10v14H6V5zm14 7h-2V10h2v2z" /></svg>,
  Target: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v8l9-11h-7z" /></svg>,
  LightBulb: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  LogOut: () => <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

function Sidebar({ onLogout, isOpen, closeSidebar }) { // <-- Nhận props isOpen và closeSidebar
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Tự động đóng sidebar khi chuyển trang trên Mobile
  useEffect(() => {
    if (closeSidebar) closeSidebar();
  }, [location.pathname]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
  };

  const isActive = (path) => location.pathname === path;
  
  const highlightText = (text) => {
    if (!searchQuery.trim()) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const baseItemClass = "flex items-center gap-3 px-3 py-2.5 mx-3 rounded-lg transition-all duration-200 outline-none border-none group cursor-pointer text-left text-sm font-medium w-[calc(100%-24px)] no-underline";
  
  const getLinkClass = (path, text) => {
    const isMatched = highlightText(text);
    if (isActive(path)) return `${baseItemClass} bg-blue-50 text-blue-700 font-semibold`;
    if (isMatched) return `${baseItemClass} bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200`;
    return `${baseItemClass} text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
  };

  const getIconClass = (path) => isActive(path) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600 transition-colors";

  return (
    <aside className={`
      /* Cấu trúc Layout cơ bản */
      w-[280px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
      
      /* Responsive: Trên Mobile là Fixed lơ lửng, trên PC là dính trong flex container */
      fixed top-0 bottom-0 left-0 z-[60] md:relative md:top-auto md:bottom-auto md:left-auto md:translate-x-0 md:flex md:h-full
      
      /* Logic ẩn hiện trên Mobile bằng biến isOpen */
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
    `}>

      {/* NÚT ĐÓNG NHANH CHO MOBILE (X) */}
      <div className="flex md:hidden justify-end p-2">
        <button onClick={closeSidebar} className="p-2 text-gray-400 hover:text-red-500 focus:outline-none border-none bg-transparent">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* SEARCH BOX */}
      <div className="px-4 py-4 shrink-0 border-b md:border-none border-gray-100">
        <form onSubmit={handleSearch} className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700 placeholder-gray-400 shadow-sm"
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* MENU SCROLLABLE */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-hide">
        <nav className="space-y-1">
          <Link to="/" className={getLinkClass('/', 'Trang Chủ')}>
            <span className={getIconClass('/')}><Icons.Home /></span>
            <span>Trang Chủ</span>
          </Link>

          <Link to="/thong-bao" className={getLinkClass('/thong-bao', 'Thông Báo')}>
            <span className={getIconClass('/thong-bao')}><Icons.Bell /></span>
            <span className="flex-1">Thông Báo</span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </Link>
          
          <Link to="/quan-ly-giao-vien" className={getLinkClass('/quan-ly-giao-vien', 'Quản Lý Giáo Viên')}>
            <span className={getIconClass('/quan-ly-giao-vien')}><Icons.Users /></span>
            <span>Quản Lý Giáo Viên</span>
          </Link>

          <Link to="/kiem-tra-noi-bo" className={getLinkClass('/kiem-tra-noi-bo', 'Kiểm Tra Nội Bộ')}>
            <span className={getIconClass('/kiem-tra-noi-bo')}><Icons.ChartBar /></span>
            <span>Kiểm Tra Nội Bộ</span>
          </Link>

          <Link to="/kiem-tra-cac-ky" className={getLinkClass('/kiem-tra-cac-ky', 'Kiểm Tra Các Kỳ')}>
            <span className={getIconClass('/kiem-tra-cac-ky')}><Icons.FileText /></span>
            <span>Kiểm Tra Các Kỳ</span>
          </Link>

          <Link to="/cong-viec-tuan" className={getLinkClass('/cong-viec-tuan', 'Công Việc Tuần')}>
            <span className={getIconClass('/cong-viec-tuan')}><Icons.Calendar /></span>
            <span>Công Việc Tuần</span>
          </Link>

          <Link to="/cong-viec-thang" className={getLinkClass('/cong-viec-thang', 'Công Việc Tháng')}>
            <span className={getIconClass('/cong-viec-thang')}><Icons.Calendar /></span>
            <span>Công Việc Tháng</span>
          </Link>

          <Link to="/hoi-thi" className={getLinkClass('/hoi-thi', 'Hội Thi')}>
            <span className={getIconClass('/hoi-thi')}><Icons.Trophy /></span>
            <span>Hội Thi</span>
          </Link>

          <a href="https://qlhsvp.onrender.com" target="_blank" rel="noopener noreferrer" className={`${baseItemClass} text-gray-600 hover:bg-gray-100 hover:text-gray-900 no-underline`}>
            <span className="text-gray-400 group-hover:text-gray-600 transition-colors"><Icons.ShieldAlert /></span>
            <span className="flex-1">QL Học Sinh Vi Phạm</span>
            <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>

          <Link to="/ra-de-kiem-tra" className={getLinkClass('/ra-de-kiem-tra', 'Ra Đề Kiểm Tra')}>
            <span className={getIconClass('/ra-de-kiem-tra')}><Icons.FileText /></span>
            <span>Ra Đề Kiểm Tra</span>
          </Link>

          <Link to="/phan-mon-so-tiet" className={getLinkClass('/phan-mon-so-tiet', 'Phân môn số tiết')}>
            <span className={getIconClass('/phan-mon-so-tiet')}><Icons.BookOpen /></span>
            <span>Phân môn số tiết</span>
          </Link>

          <Link to="/quan-ly-truc-ngay" className={getLinkClass('/quan-ly-truc-ngay', 'trực ngày')}>
            <span className={getIconClass('/quan-ly-truc-ngay')}><Icons.ShieldCheck /></span>
            <span>Quản lý trực ngày</span>
          </Link>

          <Link to="/quan-ly-xep-tkb" className={getLinkClass('/quan-ly-xep-tkb', 'xếp tkb')}>
            <span className={getIconClass('/quan-ly-xep-tkb')}><Icons.CalendarClock /></span>
            <span>Công tác xếp TKB</span>
          </Link>

          <Link to="/quan-ly-ngay-nghi" className={getLinkClass('/quan-ly-ngay-nghi', 'ngày nghỉ')}>
            <span className={getIconClass('/quan-ly-ngay-nghi')}><Icons.Coffee /></span>
            <span>Quản lý ngày nghỉ</span>
          </Link>

          <Link to="/quan-ly-hoat-dong" className={getLinkClass('/quan-ly-hoat-dong', 'hoạt động trọng điểm')}>
            <span className={getIconClass('/quan-ly-hoat-dong')}><Icons.Target /></span>
            <span>Hoạt động trọng điểm</span>
          </Link>

          <Link to="/cong-tac-rut-kinh-nghiem" className={getLinkClass('/cong-tac-rut-kinh-nghiem', 'rút kinh nghiệm')}>
            <span className={getIconClass('/cong-tac-rut-kinh-nghiem')}><Icons.LightBulb /></span>
            <span>Rút kinh nghiệm</span>
          </Link>
        </nav>
      </div>

      {/* FOOTER */}
      <div className="shrink-0 p-4 border-t border-gray-100 bg-white mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition-colors outline-none border-none group bg-transparent"
        >
          <span className="text-red-400 group-hover:text-red-500 transition-colors"><Icons.LogOut /></span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;