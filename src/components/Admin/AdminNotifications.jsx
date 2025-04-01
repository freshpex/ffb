import { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaExchangeAlt, 
  FaIdCard, 
  FaTicketAlt, 
  FaExclamationCircle, 
  FaCheck, 
  FaEye, 
  FaBell,
  FaCheckCircle,
  FaCheckDouble
} from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';

const AdminNotifications = () => {
  const { darkMode } = useDarkMode();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = "Notifications | Admin Dashboard";
    
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockNotifications = [
        {
          id: 'notif-1',
          type: 'transaction',
          title: 'Large deposit detected',
          message: 'User John Doe has made a deposit of $25,000',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          read: false,
          actionUrl: '/admin/transactions/tx-24'
        },
        {
          id: 'notif-2',
          type: 'user',
          title: 'New user registration',
          message: 'Emma Wilson has created a new account',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          actionUrl: '/admin/users/user-42'
        },
        {
          id: 'notif-3',
          type: 'kyc',
          title: 'KYC verification submitted',
          message: 'Michael Brown has submitted KYC documents for review',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          read: true,
          actionUrl: '/admin/kyc/kyc-15'
        },
        {
          id: 'notif-4',
          type: 'support',
          title: 'New support ticket opened',
          message: 'User Sarah Johnson has opened a new support ticket: Payment issue',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: true,
          actionUrl: '/admin/support/ticket-31'
        },
        {
          id: 'notif-5',
          type: 'system',
          title: 'System alert',
          message: 'High server load detected on the main database server',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: false,
          actionUrl: '/admin/settings/system'
        },
        {
          id: 'notif-6',
          type: 'transaction',
          title: 'Withdrawal pending approval',
          message: 'User David Clark has requested a withdrawal of $8,500',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          read: true,
          actionUrl: '/admin/transactions/tx-25'
        },
        {
          id: 'notif-7',
          type: 'user',
          title: 'Account locked',
          message: 'Multiple failed login attempts detected for user Robert Johnson',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: false,
          actionUrl: '/admin/users/user-18'
        },
        {
          id: 'notif-8',
          type: 'kyc',
          title: 'KYC rejected',
          message: 'Admin user has rejected KYC documents for user James Wilson',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
          read: true,
          actionUrl: '/admin/kyc/kyc-12'
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    };
    
    fetchNotifications();
  }, []);
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction':
        return <FaExchangeAlt className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <FaUser className="h-5 w-5 text-purple-500" />;
      case 'kyc':
        return <FaIdCard className="h-5 w-5 text-green-500" />;
      case 'support':
        return <FaTicketAlt className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <FaExclamationCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FaBell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDays = Math.round(diffHr / 24);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              View and manage your system notifications
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={markAllAsRead}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                darkMode 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                  : 'bg-primary-100 hover:bg-primary-200 text-primary-800'
              }`}
            >
              <FaCheckDouble className="mr-2" /> Mark All as Read
            </button>
          </div>
        </div>
        
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        }`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Notifications
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              You have {notifications.filter(n => !n.read).length} unread notifications
            </p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading notifications...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <FaBell className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    No notifications
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    You don't have any notifications at the moment.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 ${notification.read ? '' : darkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            notification.read 
                              ? darkMode ? 'text-gray-300' : 'text-gray-900' 
                              : darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className={`mr-2 p-1 rounded-full ${
                                  darkMode 
                                    ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-300' 
                                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                }`}
                                title="Mark as read"
                              >
                                <FaCheck className="h-3 w-3" />
                              </button>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              notification.read 
                                ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-800' 
                                : darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-200 text-blue-800'
                            }`}>
                              {notification.read ? (
                                <FaCheckCircle className="mr-1 h-3 w-3" />
                              ) : null}
                              {notification.read ? 'Read' : 'New'}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {notification.message}
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatRelativeTime(notification.timestamp)}
                          </span>
                          <a 
                            href={notification.actionUrl} 
                            className={`inline-flex items-center text-xs font-medium ${
                              darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                            }`}
                          >
                            <FaEye className="mr-1 h-3 w-3" /> View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminNotifications;
