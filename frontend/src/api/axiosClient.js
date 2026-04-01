import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 1. Request Interceptor: Tự động dán Token vào mỗi lần gửi đi
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Tự động "đá" ra ngoài nếu gặp lỗi 401
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu API chạy thành công, cứ trả dữ liệu về bình thường
    return response;
  },
  (error) => {
    // Nếu Server trả về lỗi 401 (Unauthorized - Cần đăng nhập)
    if (error.response && error.response.status === 401) {
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      
      // Xóa token cũ đi
      localStorage.removeItem('token');
      
      // "Đá" thẳng về trang login bằng cách load lại trang
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;