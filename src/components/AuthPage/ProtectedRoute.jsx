import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../common/Loader";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  // console.log("Authentication state:", { token, loading, showLoader });

  if (loading) {
    return <Loader text="Authenticating..." />;
  }

  // Only check for token existence
  if (!token) {
    // console.log("Access denied - no token found - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // console.log("Access granted to protected route");
  return children;
};

export default ProtectedRoute;
