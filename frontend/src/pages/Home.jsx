import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Danh sách ảnh banner - bạn có thể thay đổi đường dẫn ảnh
  const bannerImages = [
    'https://scontent.fsgn5-1.fna.fbcdn.net/v/t39.30808-6/625677201_1223759289950107_4305248690588167671_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Hz2vG7s4FGwQ7kNvwHLBJdQ&_nc_oc=AdoDYUxZ6tdPEvCBivdeC5n_Op_zL3IRSYAnYAkizFSUBLdoLvWVn60-K2Ue_bW3qP3fi9ugWCrwOHKssFaUkvxp&_nc_zt=23&_nc_ht=scontent.fsgn5-1.fna&_nc_gid=tuDcICDlJCgk7OOkNdt__Q&_nc_ss=7a3a8&oh=00_Af0f51Y_HinhVC0L_sSW8GmQYGFczlxNwVZWVb_kqWRZ1w&oe=69D43F3C',
    'https://scontent.fsgn5-1.fna.fbcdn.net/v/t39.30808-6/623436381_1223759293283440_7738764178217492890_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7b2446&_nc_ohc=g0OoPQSACrQQ7kNvwE-eooZ&_nc_oc=AdoOzvA_5D5xhyCJbRjj_URSV4A6A7MD4xPyaoybARSLaGIFDSn0DnHk-sZUZorZLXW7JlQLSmFC-W1kKKLuk4Qe&_nc_zt=23&_nc_ht=scontent.fsgn5-1.fna&_nc_gid=v4sipS1FbJLhwOKl-VQGVQ&_nc_ss=7a3a8&oh=00_Af2jJZFgMIYODpjdKIYdUWpd0TL29ZVpM5ZIDtkMXsWurA&oe=69D461D3',
    'https://scontent.fsgn5-1.fna.fbcdn.net/v/t39.30808-6/623117824_1223759249950111_6641323100908694575_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=tsrAVZGOO_cQ7kNvwE0fA-g&_nc_oc=Adoky9H6DqOXQtsb1lYPPAD_VvVl3f5-Cy1DqqCq8tJ3ugft537QK79VG6Oe7nQjZHBIbrAp40yNCfLiX8dq_vdp&_nc_zt=23&_nc_ht=scontent.fsgn5-1.fna&_nc_gid=En4feXs3R6hFPtAmh1Z2oQ&_nc_ss=7a3a8&oh=00_Af28RBK4CUqOZdtv0jtQ2fziTHwwA4khMKD0gcxdF6r3Zw&oe=69D45CB7',
    'https://scontent.fsgn5-7.fna.fbcdn.net/v/t39.30808-6/622690618_1219697200356316_1757030783888382441_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_ohc=ng2Nce7PAJ8Q7kNvwEmWzhO&_nc_oc=AdrdOcCZYWRNa4HH8zDQOUWSCK50U-NkBPuevG4Vf_4-jsapfsAsFiv0Af0E9H-LCva4rfX5TtJWPQ6MpA0Pl43g&_nc_zt=23&_nc_ht=scontent.fsgn5-7.fna&_nc_gid=m3GV6_kTuQxBPZrt5ZbFRA&_nc_ss=7a3a8&oh=00_Af0b0UdUcU-301vL6xx-JB1JqiYYfHWGgXPrQ9JwERg_mQ&oe=69D440F4'
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
