import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
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
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import component vừa tạo
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <Router>
      <div className="App">
        {/* Chỉ hiện Header khi đã đăng nhập */}
        {isLoggedIn && <Header onLogout={handleLogout} />}
        
        <main className={isLoggedIn ? "main-content" : ""}>
          <Routes>
            {/* Route Đăng nhập/Đăng ký công khai */}
            <Route 
              path="/login" 
              element={!isLoggedIn ? <Auth onLoginSuccess={() => setIsLoggedIn(true)} /> : <Navigate to="/" />} 
            />

            {/* Các Route cần Bảo vệ - Nếu chưa login sẽ bị đá về /login */}
            <Route path="/" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}><Home /></ProtectedRoute>
            } />
            
            <Route path="/quan-ly-giao-vien" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}><TeacherManagement /></ProtectedRoute>
            } />
            
            <Route path="/phan-cong-tiet" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}><AssignmentManagement /></ProtectedRoute>
            } />

            {/* Thêm các trang khác tương tự ở đây... */}
            <Route path="/kiem-tra-noi-bo" element={<ProtectedRoute isLoggedIn={isLoggedIn}><InspectionManagement /></ProtectedRoute>} />
            <Route path="/kiem-tra-cac-ky" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ExamPeriodInspection /></ProtectedRoute>} />
            <Route path="/cong-viec-tuan" element={<ProtectedRoute isLoggedIn={isLoggedIn}><WeeklyTasks /></ProtectedRoute>} />
            <Route path="/cong-viec-thang" element={<ProtectedRoute isLoggedIn={isLoggedIn}><MonthlyTasks /></ProtectedRoute>} />
            <Route path="/hoi-thi" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Competitions /></ProtectedRoute>} />
            <Route path="/ra-de-kiem-tra" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ExamPreparation /></ProtectedRoute>} />
            <Route path="/thong-bao" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Notifications /></ProtectedRoute>} />

            {/* Mặc định: Nếu chưa login đá về /login, nếu rồi thì về Home */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;