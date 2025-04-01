import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { checkAdminAuth, selectIsAdminAuthenticated, selectAdminStatus, clearError } from '../../redux/slices/adminAuthSlice';
import FullPageLoader from '../common/FullPageLoader';

const AdminProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authCheckAttempted, setAuthCheckAttempted] = useState(false);
  
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);
  const status = useSelector(selectAdminStatus);
  
  useEffect(() => {
    // Clear any existing errors
    dispatch(clearError());
    
    // Check authentication only once
    if (!authCheckAttempted) {
      // For demo/development - if no token exists, create a mock one
      if (!localStorage.getItem('ffb_admin_token')) {
        localStorage.setItem('ffb_admin_token', 'mock-admin-jwt-token');
      }
      
      dispatch(checkAdminAuth())
        .unwrap()
        .catch(() => {
          navigate('/admin/login');
        })
        .finally(() => {
          setAuthCheckAttempted(true);
        });
    }
  }, [dispatch, navigate, authCheckAttempted]);
  
  if ((status === 'loading' || status === 'idle') && !authCheckAttempted) {
    return <FullPageLoader />;
  }
  
  return children;
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default AdminProtectedRoute;
