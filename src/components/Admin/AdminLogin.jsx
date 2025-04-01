import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaShieldAlt, FaExclamationCircle } from 'react-icons/fa';
import { loginAdmin, selectIsAdminAuthenticated, selectAdminStatus, selectAdminError, clearError } from '../../redux/slices/adminAuthSlice';
import { useDarkMode } from '../../context/DarkModeContext';

const AdminLogin = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);
  const status = useSelector(selectAdminStatus);
  const error = useSelector(selectAdminError);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  useEffect(() => {
    // If already authenticated, redirect to admin dashboard
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
    
    // Clear any previous login errors when component mounts
    dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin(credentials));
  };
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full p-8 rounded-xl ${
        darkMode 
          ? 'bg-gray-800 shadow-lg shadow-gray-800/50' 
          : 'bg-white shadow-lg'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${
              darkMode ? 'bg-primary-900/30' : 'bg-primary-100'
            } flex items-center justify-center`}>
              <FaShieldAlt className="text-3xl text-primary-500" />
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Portal
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Log in to access your administrator dashboard
          </p>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 mb-6 rounded-lg flex items-start ${
              darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
            }`}
          >
            <FaExclamationCircle className="mt-1 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className={`block mb-2 text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`block w-full pl-10 py-3 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600'
                  } rounded-lg border`}
                  placeholder="admin@example.com"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className={`block mb-2 text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`block w-full pl-10 py-3 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600'
                  } rounded-lg border`}
                  placeholder="••••••••"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className={`w-4 h-4 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-primary-600 focus:ring-primary-600' 
                      : 'bg-gray-50 border-gray-300 text-primary-600 focus:ring-primary-600'
                  } rounded border`}
                />
                <label htmlFor="remember-me" className={`ml-2 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-3 px-4 ${
                status === 'loading'
                  ? 'bg-primary-600 opacity-70 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
              }`}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Log In'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Return to{' '}
            <a href="/" className="text-primary-500 hover:text-primary-600">
              Main Website
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
