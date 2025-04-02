import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdminAuthenticated } from '../../redux/slices/adminAuthSlice';

const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;
