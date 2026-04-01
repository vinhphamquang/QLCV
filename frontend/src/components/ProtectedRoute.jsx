import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, đá về trang login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;