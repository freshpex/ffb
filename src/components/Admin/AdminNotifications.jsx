import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaBell, 
  FaUser, 
  FaClock, 
  FaCheck,
  FaTrashAlt, 
  FaExclamationTriangle, 
  FaTimes,
  FaCheckDouble,
  FaEnvelope,
  FaExclamationCircle,
  FaInfoCircle,
  FaLock,
  FaCreditCard,
  FaServer
} from 'react-icons/fa';
import { 
  fetchAdminNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  selectAdminNotifications,
  selectAdminNotificationStatus,
  selectAdminNotificationError,
  selectAdminNotificationActionStatus
} from '../../redux/slices/adminNotificationSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';

const AdminNotifications = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();
  
  const notifications = useSelector(selectAdminNotifications);
  const status = useSelector(selectAdminNotificationStatus);
  const error = useSelector(selectAdminNotificationError);
  const actionStatus = useSelector(selectAdminNotificationActionStatus);
  
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  useEffect(() => {
    document.title = "Notifications | Admin Dashboard";
    dispatch(fetchAdminNotifications());
  }, [dispatch]);
  
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };
  
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };
  
  const handleDeleteNotification = (id) => {
    setDeleteConfirmation(null);
    dispatch(deleteNotification(id));
  };
  
  // Format date to a friendly format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than a minute
    if (diff < 60 * 1000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user':
        return <FaUser className="h-6 w-6 text-blue-500" />;
      case 'security':
        return <FaLock className="h-6 w-6 text-red-500" />;
      case 'system':
        return <FaServer className="h-6 w-6 text-purple-500" />;
      case 'transaction':
        return <FaCreditCard className="h-6 w-6 text-green-500" />;
      case 'alert':
        return <FaExclamationCircle className="h-6 w-6 text-orange-500" />;
      case 'message':
        return <FaEnvelope className="h-6 w-6 text-blue-500" />;
      case 'info':
      default:
        return <FaInfoCircle className="h-6 w-6 text-blue-500" />;
    }
  };
  
  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const isLoading = status === 'loading';
  const isActionLoading = actionStatus === 'loading';
  
  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Notifications
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            View and manage your system notifications
          </p>
        </div>
        
        {error && (
          <div className={`mb-4 p-3 rounded-md ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </p>
          </div>
        )}
        
        <div className={`mb-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? darkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-100 text-primary-700'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'unread'
                    ? darkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-100 text-primary-700'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'read'
                    ? darkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-100 text-primary-700'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Read
              </button>
            </div>
            
            <button
              onClick={handleMarkAllAsRead}
              disabled={isActionLoading || notifications.every(n => n.read)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActionLoading || notifications.every(n => n.read)
                  ? darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : darkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <FaCheckDouble className="inline mr-2" /> Mark All as Read
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <ComponentLoader height="400px" message="Loading notifications..." />
        ) : (
          <>
            {sortedNotifications.length === 0 ? (
              <div className={`rounded-lg p-6 text-center ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <FaBell className={`mx-auto h-12 w-12 mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No notifications found
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filter === 'all' 
                    ? "You don't have any notifications yet."
                    : filter === 'unread'
                      ? "You don't have any unread notifications."
                      : "You don't have any read notifications."}
                </p>
              </div>
            ) : (
              <div className={`rounded-lg overflow-hidden ${
                darkMode ? 'border border-gray-700' : 'border border-gray-200 shadow-sm'
              }`}>
                <div className={`p-4 border-b ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {filter === 'all' 
                      ? 'All Notifications'
                      : filter === 'unread'
                        ? 'Unread Notifications'
                        : 'Read Notifications'}
                  </h2>
                </div>
                
                <ul className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {sortedNotifications.map((notification) => (
                    <li
                      key={notification._id || notification.id}
                      className={`p-4 ${
                        !notification.read 
                          ? darkMode 
                            ? 'bg-gray-700/30' 
                            : 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className="flex">
                        <div className={`p-2 mr-4 rounded-full ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </div>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <FaClock className="mr-1" />
                            {formatDate(notification.createdAt)}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id || notification.id)}
                              disabled={isActionLoading}
                              className={`p-1.5 rounded-full ${
                                darkMode 
                                  ? 'bg-gray-700 text-green-400 hover:bg-gray-600' 
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                              title="Mark as Read"
                            >
                              <FaCheck className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setDeleteConfirmation(notification._id || notification.id)}
                            disabled={isActionLoading}
                            className={`p-1.5 rounded-full ${
                              darkMode 
                                ? 'bg-gray-700 text-red-400 hover:bg-gray-600' 
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                            title="Delete Notification"
                          >
                            <FaTrashAlt className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                    darkMode ? 'bg-red-900/30' : 'bg-red-100'
                  } sm:mx-0 sm:h-10 sm:w-10`}>
                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Delete Notification
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Are you sure you want to delete this notification? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={() => handleDeleteNotification(deleteConfirmation)}
                  disabled={isActionLoading}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    isActionLoading 
                      ? 'bg-red-500 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {isActionLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmation(null)}
                  disabled={isActionLoading}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode 
                      ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminNotifications;
