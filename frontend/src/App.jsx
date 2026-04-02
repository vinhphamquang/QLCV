import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import TeacherManagement from './pages/TeacherManagement';
import InspectionManagement from './pages/InspectionManagement';
import ExamPeriodInspection from './pages/ExamPeriodInspection';
import WeeklyTasks from './pages/WeeklyTasks';
import MonthlyTasks from './pages/MonthlyTasks';
import Competitions from './pages/Competitions';
import ExamPreparation from './pages/ExamPreparation';
import Notifications from './pages/Notifications';
import Auth from './components/Auth';
import AssignmentManagement from './pages/AssignmentManagement';
import DailyDuty from './pages/DailyDutyManagement';
// Tạm thời có thể bỏ import ProtectedRoute nếu dùng cách chặn vòng ngoài này
// import ProtectedRoute from './components/ProtectedRoute'; 
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  // 1. CHẶN VÒNG NGOÀI: Nếu chưa đăng nhập, HIỂN THỊ MỖI TRANG AUTH
  if (!isLoggedIn) {
    return (
      <Auth onLoginSuccess={() => setIsLoggedIn(true)} />
    );
  }

  // 2. ĐÃ ĐĂNG NHẬP: Hiển thị toàn bộ hệ thống quản lý
  return (
    <Router>
      <div className="App">
        {/* Truyền handleLogout xuống Sidebar hoặc Topbar để làm nút Đăng xuất */}
        <Sidebar onLogout={handleLogout} /> 
        
        <div className="main-wrapper">
          <Topbar onLogout={handleLogout} /> 
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quan-ly-giao-vien" element={<TeacherManagement />} />
              <Route path="/kiem-tra-noi-bo" element={<InspectionManagement />} />
              <Route path="/kiem-tra-cac-ky" element={<ExamPeriodInspection />} />
              <Route path="/cong-viec-tuan" element={<WeeklyTasks />} />
              <Route path="/cong-viec-thang" element={<MonthlyTasks />} />
              <Route path="/hoi-thi" element={<Competitions />} />
              <Route path="/ra-de-kiem-tra" element={<ExamPreparation />} />
              <Route path="/thong-bao" element={<Notifications />} />
              <Route path="/phan-mon-so-tiet" element={<AssignmentManagement />} />
              <Route path="/quan-ly-truc-ngay" element={<DailyDuty />} />
              
              {/* BẮT LỖI 404: Nếu gõ đường dẫn bậy, tự động văng về trang chủ */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;