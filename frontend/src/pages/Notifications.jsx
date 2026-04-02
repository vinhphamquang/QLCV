import { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

function Notifications() {
  const [upcomingInspections, setUpcomingInspections] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [upcomingExamPeriods, setUpcomingExamPeriods] = useState([]);
  const [upcomingWeeklyTasks, setUpcomingWeeklyTasks] = useState([]);
  const [upcomingMonthlyTasks, setUpcomingMonthlyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [inspectionsRes, examsRes, examPeriodsRes, weeklyRes, monthlyRes] = await Promise.all([
        axios.get('http://localhost:5000/api/inspections/upcoming').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/exam-preparations/upcoming').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/exam-period-inspections/upcoming').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/weekly-tasks/upcoming').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/monthly-tasks/upcoming').catch(() => ({ data: [] }))
      ]);
      
      setUpcomingInspections(inspectionsRes.data);
      setUpcomingExams(examsRes.data);
      setUpcomingExamPeriods(examPeriodsRes.data);
      setUpcomingWeeklyTasks(weeklyRes.data);
      setUpcomingMonthlyTasks(monthlyRes.data);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    if (diffDays < 0) return `Quá ${Math.abs(diffDays)} ngày`;
    return `Còn ${diffDays} ngày`;
  };

  const getUrgencyClass = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'normal';
  };

  const totalNotifications = upcomingInspections.length + upcomingExams.length + 
                            upcomingExamPeriods.length + upcomingWeeklyTasks.length + 
                            upcomingMonthlyTasks.length;

  if (loading) {
    return (
      <div className="notifications">
        <div className="notifications-header">
          <h2>🔔 Thông Báo & Nhắc Nhở</h2>
          <p>Theo dõi các công việc và sự kiện sắp tới</p>
        </div>
        <p className="loading">⏳ Đang tải thông báo...</p>
      </div>
    );
  }

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h2>🔔 Thông Báo & Nhắc Nhở</h2>
        <p>Theo dõi các công việc và sự kiện sắp tới trong 7 ngày</p>
      </div>

      <div className="header-section">
        <h3 style={{ color: '#f59e0b', fontSize: '1.5rem' }}>📋 Danh Sách Thông Báo</h3>
        <button className="btn-refresh" onClick={fetchNotifications}>
          🔄 Làm Mới
        </button>
      </div>

      <div className="notifications-grid">
        {/* Kiểm tra nội bộ */}
        <div className="notification-section">
          <h3>
            <span className="icon">📋</span>
            Kiểm Tra Nội Bộ
          </h3>
          {upcomingInspections.length > 0 ? (
            <div className="notification-list">
              {upcomingInspections.map((inspection) => (
                <div 
                  key={inspection._id} 
                  className={`notification-card ${getUrgencyClass(inspection.thoiGianKiemTra)}`}
                >
                  <div className="notification-header">
                    <span className="badge">{getDaysUntil(inspection.thoiGianKiemTra)}</span>
                    <span className="date">{formatDateTime(inspection.thoiGianKiemTra)}</span>
                  </div>
                  <div className="notification-body">
                    <p className="teacher-name">👨‍🏫 {inspection.tenGiaoVien}</p>
                    <p className="content">📝 {inspection.noiDungKiemTra}</p>
                    <p className="period">⏰ Tiết: {inspection.tietKiemTra}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">✅ Không có kiểm tra nội bộ nào</p>
          )}
        </div>

        {/* Kiểm tra các kỳ */}
        <div className="notification-section">
          <h3>
            <span className="icon">📝</span>
            Kiểm Tra Các Kỳ
          </h3>
          {upcomingExamPeriods.length > 0 ? (
            <div className="notification-list">
              {upcomingExamPeriods.map((exam) => (
                <div 
                  key={exam._id} 
                  className={`notification-card ${getUrgencyClass(exam.ngay)}`}
                >
                  <div className="notification-header">
                    <span className="badge">{getDaysUntil(exam.ngay)}</span>
                    <span className="date">{formatDate(exam.ngay)}</span>
                  </div>
                  <div className="notification-body">
                    <p className="subject">📚 Môn: {exam.mon}</p>
                    {exam.noiDungConHanChe && <p className="content">⚠️ {exam.noiDungConHanChe}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">✅ Không có kiểm tra các kỳ nào</p>
          )}
        </div>

        {/* Công việc tuần */}
        <div className="notification-section">
          <h3>
            <span className="icon">📅</span>
            Công Việc Tuần
          </h3>
          {upcomingWeeklyTasks.length > 0 ? (
            <div className="notification-list">
              {upcomingWeeklyTasks.map((task) => (
                <div 
                  key={task._id} 
                  className={`notification-card ${getUrgencyClass(task.thoiGian)}`}
                >
                  <div className="notification-header">
                    <span className="badge">{getDaysUntil(task.thoiGian)}</span>
                    <span className="date">{formatDateTime(task.thoiGian)}</span>
                  </div>
                  <div className="notification-body">
                    <p className="subject">📌 {task.thu}</p>
                    <p className="content">{task.noiDungCongViec}</p>
                    {task.diaDiem && <p className="period">📍 {task.diaDiem}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">✅ Không có công việc tuần nào</p>
          )}
        </div>

        {/* Công việc tháng */}
        <div className="notification-section">
          <h3>
            <span className="icon">📆</span>
            Công Việc Tháng
          </h3>
          {upcomingMonthlyTasks.length > 0 ? (
            <div className="notification-list">
              {upcomingMonthlyTasks.map((task) => (
                <div 
                  key={task._id} 
                  className={`notification-card ${getUrgencyClass(task.thoiGian)}`}
                >
                  <div className="notification-header">
                    <span className="badge">{getDaysUntil(task.thoiGian)}</span>
                    <span className="date">{formatDateTime(task.thoiGian)}</span>
                  </div>
                  <div className="notification-body">
                    <p className="subject">📌 {task.tuan} - {task.thu}</p>
                    <p className="content">{task.noiDung}</p>
                    <p className="person">👤 Giao việc: {task.giaoViec}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">✅ Không có công việc tháng nào</p>
          )}
        </div>

        {/* Ra đề kiểm tra */}
        <div className="notification-section">
          <h3>
            <span className="icon">📄</span>
            Ra Đề Kiểm Tra
          </h3>
          {upcomingExams.length > 0 ? (
            <div className="notification-list">
              {upcomingExams.map((exam) => (
                <div 
                  key={exam._id} 
                  className={`notification-card ${getUrgencyClass(exam.ngayNop)}`}
                >
                  <div className="notification-header">
                    <span className="badge">{getDaysUntil(exam.ngayNop)}</span>
                    <span className="date">{formatDate(exam.ngayNop)}</span>
                  </div>
                  <div className="notification-body">
                    <p className="subject">📚 Môn: {exam.mon}</p>
                    <p className="person">👤 Người ra đề: {exam.nguoiRaDe}</p>
                    <p className="person">📤 Người nộp: {exam.nguoiNop}</p>
                    <p className="time">⏱️ Thời gian: {exam.thoiGianLamBai}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">✅ Không có đề kiểm tra nào cần nộp</p>
          )}
        </div>
      </div>

      {/* Tổng quan */}
      <div className="summary">
        <div className="summary-card">
          <div className="summary-number">{upcomingInspections.length}</div>
          <div className="summary-label">📋 Kiểm tra nội bộ</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{upcomingExamPeriods.length}</div>
          <div className="summary-label">📝 Kiểm tra các kỳ</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{upcomingWeeklyTasks.length}</div>
          <div className="summary-label">📅 Công việc tuần</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{upcomingMonthlyTasks.length}</div>
          <div className="summary-label">📆 Công việc tháng</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{upcomingExams.length}</div>
          <div className="summary-label">📄 Ra đề kiểm tra</div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-number">{totalNotifications}</div>
          <div className="summary-label">📊 Tổng số công việc</div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
