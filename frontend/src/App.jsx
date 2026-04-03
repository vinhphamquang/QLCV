import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORT COMPONENTS ---
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Auth from './components/Auth';
import Footer from './components/Footer';

// --- IMPORT PAGES ---
import Home from './pages/Home';
import Profile from './pages/Profile';
import TeacherManagement from './pages/TeacherManagement';
import InspectionManagement from './pages/InspectionManagement';
import ExamPeriodInspection from './pages/ExamPeriodInspection';
import WeeklyTasks from './pages/WeeklyTasks';
import MonthlyTasks from './pages/MonthlyTasks';
import Competitions from './pages/Competitions';
import ExamPreparation from './pages/ExamPreparation';
import Notifications from './pages/Notifications';
import AssignmentManagement from './pages/AssignmentManagement';

// --- IMPORT STYLES ---
import './App.css';
import './styles/buttons.css';
import './styles/header.css';
import DailyDuty from './pages/DailyDutyManagement';
import TimetableManagement from './pages/TimetableManagement';
import HolidayManagement from './pages/HolidayManagement';
import KeyActivityManagement from './pages/KeyActivityManagement';
import LessonLearnedManagement from './pages/LessonLearnedManagement';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // LOGIC RESPONSIVE: Trạng thái đóng/mở Sidebar trên Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false); // Đóng sidebar khi logout
  };

  // Hàm điều khiển Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Auth onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen w-full bg-gray-50 font-sans overflow-hidden">
        
        {/* 1. HEADER NẰM TRÊN CÙNG */}
        <Header onLogout={handleLogout} toggleSidebar={toggleSidebar} />
        
        {/* 2. KHU VỰC GIỮA: Sidebar (Trái) + Nội dung (Phải) */}
        <div className="flex flex-1 overflow-hidden relative min-h-0">
          
          {/* SIDEBAR */}
          <Sidebar 
            onLogout={handleLogout} 
            isOpen={isSidebarOpen} 
            closeSidebar={closeSidebar} 
          /> 
          
          {/* LỚP PHỦ MOBILE */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/40 z-[55] md:hidden backdrop-blur-[2px] transition-opacity duration-300"
              onClick={closeSidebar}
            ></div>
          )}
          
          {/* NỘI DUNG CHÍNH - scroll riêng, không bao gồm footer */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ho-so" element={<Profile />} />
                
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
                <Route path="/quan-ly-xep-tkb" element={<TimetableManagement />} />
                <Route path="/quan-ly-ngay-nghi" element={<HolidayManagement />} />
                <Route path="/quan-ly-hoat-dong" element={<KeyActivityManagement />} />
                <Route path="/cong-tac-rut-kinh-nghiem" element={<LessonLearnedManagement />} />

                {/* BẮT LỖI 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
          
        </div>

        {/* 3. FOOTER NẰM CUỐI - full width, dưới cả sidebar lẫn content */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;