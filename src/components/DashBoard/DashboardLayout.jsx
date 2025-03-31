import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar, selectSidebarOpen } from '../../redux/slices/layoutSlice';

import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import Loader from '../common/Loader';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isSidebarOpen = useSelector(selectSidebarOpen);
  
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle click outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only apply this on mobile
      if (isMobile && isSidebarOpen) {
        // Check if click is outside sidebar
        const sidebar = document.getElementById('dashboard-sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          dispatch(toggleSidebar(false));
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen, dispatch]);
  
  // Simulate loading on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Toggle sidebar handler
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <Loader size="large" color="primary" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar Backdrop (Mobile) */}
      {isMobile && (
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => dispatch(toggleSidebar(false))}
            />
          )}
        </AnimatePresence>
      )}
      
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div id="dashboard-sidebar">
            <DashboardSidebar isMobile={isMobile} />
          </div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Header */}
        <DashboardHeader 
          isMobile={isMobile} 
          toggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        
        {/* Main content area */}
        <main className="flex-grow overflow-auto bg-gray-900 relative">
          {/* Content container */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
