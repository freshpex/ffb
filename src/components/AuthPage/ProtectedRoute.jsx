import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../common/Loader";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

 
  if (loading) {
    return <Loader text="Authenticating..." />;
  }

  // Only check for token existence
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
