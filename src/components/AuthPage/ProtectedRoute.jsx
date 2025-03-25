import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../Loader";

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, userData, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminRequired && userData && userData.role !== 'admin' && userData.role !== 'superadmin') {
    return <Navigate to="/login/dashboardpage" />;
  }

  return children;
};

export default ProtectedRoute;
