import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaChevronLeft,
  FaBell, 
  FaQuestionCircle, 
  FaMoon, 
  FaSun 
} from 'react-icons/fa';
import { toggleSidebar, toggleTheme, selectTheme } from '../../redux/slices/layoutSlice';
import { selectUserProfile } from '../../redux/selectors/selectors';
import { 
  fetchNotifications,
  selectNotifications, 
  selectUnreadCount 
} from '../../redux/slices/notificationSlice';
import DashboardBreadcrumbs from './DashboardBreadcrumbs';
import NotificationsPanel from './NotificationsPanel';

const DashboardHeader = ({ isMobile, isSidebarOpen, onToggleSidebar }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const notifications = useSelector(selectNotifications) || [];
  const theme = useSelector(selectTheme);
  const unreadNotificationsCount = useSelector(selectUnreadCount) || 0;
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      dispatch(toggleSidebar());
    }
  };
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    // Fetch notifications count on component mount
    dispatch(fetchNotifications({ limit: 1 }));
    
    // Set up polling every 2 minutes
    const intervalId = setInterval(() => {
      dispatch(fetchNotifications({ limit: 1 }));
    }, 120000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      dispatch(fetchNotifications());
    }
  };
  
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {/* Sidebar toggle */}
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-lg mr-2 text-gray-400 hover:text-white hover:bg-gray-700/50"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FaChevronLeft /> : <FaBars />}
          </button>
          
          {/* Breadcrumbs */}
          <div className="hidden md:block">
            <DashboardBreadcrumbs />
          </div>
          
          {/* Mobile title - visible only on mobile */}
          <div className="md:hidden">
            <h1 className="text-white font-medium">
              Fidelity First Bank
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
          
          {/* Help button */}
          <button
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
            aria-label="Help"
          >
            <FaQuestionCircle />
          </button>
          
          {/* Notifications */}
          <div className="relative ml-3">
            <button
              onClick={toggleNotifications}
              className={`p-2 rounded-md ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 relative`}
            >
              <FaBell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
            
            {/* Notifications Panel */}
            <NotificationsPanel 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
            />
          </div>
          
          {/* User menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 rounded-full hover:bg-gray-700/50 py-1 px-2"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold">
                {userProfile?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">
                  {userProfile?.fullName || 'User Name'}
                </div>
                <div className="text-xs text-gray-400">
                  Premium Member
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
