import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Danh sách ảnh banner - bạn có thể thay đổi đường dẫn ảnh
  const bannerImages = [
    '/banner1.jpg',
    '/banner2.jpg',
    '/banner3.jpg',
    '/banner4.jpg'
  ];

  // Auto slide mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <div className="home">
      {/* Banner Slideshow */}
      <div className="banner-container">
        <div className="banner-slideshow">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="banner-overlay">
                <h1>Trường THCS Trần Phú</h1>
                <p>TP. Trà Vinh - Nơi ươm mầm tri thức</p>
              </div>
            </div>
          ))}
          
          {/* Navigation Arrows */}
          <button className="banner-arrow banner-arrow-left" onClick={prevSlide}>
            ❮
          </button>
          <button className="banner-arrow banner-arrow-right" onClick={nextSlide}>
            ❯
          </button>
          
          {/* Dots Navigation */}
          <div className="banner-dots">
            {bannerImages.map((_, index) => (
              <span
                key={index}
                className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero-section">
        <h1>Hệ Thống Quản Lý Nhà Trường</h1>
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
