import { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

function Notifications() {
  const [upcomingInspections, setUpcomingInspections] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [inspectionsRes, examsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/inspections/upcoming'),
        axios.get('http://localhost:5000/api/exam-preparations/upcoming')
      ]);
      
      setUpcomingInspections(inspectionsRes.data);
      setUpcomingExams(examsRes.data);
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

  if (loading) {
    return (
      <div className="notifications">
        <h2>Thông Báo Tới Hẹn</h2>
        <p className="loading">Đang tải thông báo...</p>
      </div>
    );
  }

  return (
    <div className="notifications">
      <div className="header-section">
        <h2>Thông Báo Tới Hẹn</h2>
        <button className="btn-refresh" onClick={fetchNotifications}>
          🔄 Làm Mới
        </button>
      </div>

      <div className="notifications-grid">
        {/* Kiểm tra nội bộ sắp tới */}
        <div className="notification-section">
          <h3>
            <span className="icon">📋</span>
            Kiểm Tra Nội Bộ Sắp Tới
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
                    <p className="content">{inspection.noiDungKiemTra}</p>
                    <p className="period">Tiết: {inspection.tietKiemTra}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">Không có kiểm tra nội bộ nào trong 7 ngày tới</p>
          )}
        </div>

        {/* Đề kiểm tra sắp nộp */}
        <div className="notification-section">
          <h3>
            <span className="icon">📝</span>
            Đề Kiểm Tra Sắp Nộp
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
                    <p className="person">Người ra đề: {exam.nguoiRaDe}</p>
                    <p className="person">Người nộp: {exam.nguoiNop}</p>
                    <p className="time">Thời gian: {exam.thoiGianLamBai}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">Không có đề kiểm tra nào cần nộp trong 7 ngày tới</p>
          )}
        </div>
      </div>

      {/* Tổng quan */}
      <div className="summary">
        <div className="summary-card">
          <div className="summary-number">{upcomingInspections.length}</div>
          <div className="summary-label">Kiểm tra nội bộ sắp tới</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{upcomingExams.length}</div>
          <div className="summary-label">Đề kiểm tra cần nộp</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">
            {upcomingInspections.length + upcomingExams.length}
          </div>
          <div className="summary-label">Tổng số công việc</div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
