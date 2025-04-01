import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBars, 
  FaBell, 
  FaSearch, 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt, 
  FaQuestionCircle,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';

const AdminHeader = ({ toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const notifications = [
    {
      id: 'notif-1',
      title: 'New User Registration',
      message: 'John Doe has registered a new account',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Transaction Alert',
      message: 'Large withdrawal detected: $25,000',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'notif-3',
      title: 'KYC Document Submitted',
      message: 'Emma Wilson has submitted verification documents',
      time: '3 hours ago',
      read: false
    },
    {
      id: 'notif-4',
      title: 'Support Ticket Updated',
      message: 'Ticket #125 has been resolved',
      time: '1 day ago',
      read: true
    }
  ];
  
  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };
  
  return (
    <header className={`sticky top-0 z-30 h-16 flex items-center px-4 ${
      darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'
    } shadow-sm`}>
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md text-gray-500 hover:text-gray-800 focus:outline-none ${
              darkMode ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-gray-100'
            }`}
          >
            <FaBars className="h-5 w-5" />
          </button>
          
          <div className="ml-4 md:ml-6 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className={`w-64 pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500'
                } border`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-md focus:outline-none ${
              darkMode 
                ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-md text-gray-500 focus:outline-none ${
                darkMode 
                  ? 'hover:bg-gray-700 hover:text-white' 
                  : 'hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span className="sr-only">View notifications</span>
              <FaBell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className={`origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg overflow-hidden ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Notifications
                  </h3>
                  <button
                    onClick={markAllAsRead}
                    className={`text-xs underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 ${notification.read ? '' : darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
                    >
                      <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/admin/notifications"
                    className={`block text-center text-sm py-1 rounded-md ${
                      darkMode 
                        ? 'text-primary-500 hover:bg-gray-700' 
                        : 'text-primary-600 hover:bg-gray-100'
                    }`}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1.5 rounded-full focus:outline-none"
            >
              <span className="sr-only">Open user menu</span>
              <FaUserCircle className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            {showUserMenu && (
              <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Admin User
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    admin@fidelityfirst.com
                  </p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-1`}>
                  <Link
                    to="/admin/profile"
                    className={`flex items-center px-4 py-2 text-sm ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <FaUserCircle className="mr-3 h-4 w-4" />
                    Your Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className={`flex items-center px-4 py-2 text-sm ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <FaCog className="mr-3 h-4 w-4" />
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    className={`flex items-center px-4 py-2 text-sm ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <FaQuestionCircle className="mr-3 h-4 w-4" />
                    Help Center
                  </Link>
                  <button
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
