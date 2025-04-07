import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAdminAuthenticated, checkAdminAuth, selectAdminStatus } from '../../redux/slices/adminAuthSlice';
import Loader from '../Loader';

const AdminProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);
  const status = useSelector(selectAdminStatus);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          await dispatch(checkAdminAuth()).unwrap();
        } catch (error) {
          console.error('Admin authentication check failed:', error);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (isChecking || status === 'loading') {
    return <Loader />;
  }
  
  if (!isAuthenticated) {
    console.log('Admin not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;
