import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAdminAuthenticated,
  checkAdminAuth,
  selectAdminStatus,
} from "../../redux/slices/adminAuthSlice";
import Loader from "../common/Loader";

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
          console.error("Admin authentication check failed:", error);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (isChecking || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader size="large" color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
