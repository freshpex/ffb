import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import HomeFooter from "./LandingPage/HomeFooter";
import Header from "./LandingPage/Header";

const ErrorPage = ({ code = 404, message = "Page not found" }) => {
  return (
    <>
      <Header />
      <div className="error-page">
        <motion.div 
          className="error-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <h1>{code}</h1>
          <h2>{message}</h2>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          
          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              <FaHome /> Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-outline">
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
      <HomeFooter />
    </>
  );
};

export default ErrorPage;
