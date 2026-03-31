import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Chào Mừng Đến Với Hệ Thống Quản Lý Nhà Trường</h1>
        <p>Quản lý thông tin giáo viên một cách hiệu quả và chuyên nghiệp</p>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">👨‍🏫</div>
          <h3>Quản Lý Giáo Viên</h3>
          <p>Theo dõi thông tin, vi phạm và thành tích của giáo viên</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Kiểm Tra Nội Bộ</h3>
          <p>Quản lý công tác kiểm tra, đánh giá và rút kinh nghiệm</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍🎓</div>
          <h3>Quản Lý Học Sinh Vi Phạm</h3>
          <p>Theo dõi và xử lý các vi phạm của học sinh</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⏰</div>
          <h3>Theo Dõi Thời Gian</h3>
          <p>Ghi nhận ngày vắng và thời gian cụ thể</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
