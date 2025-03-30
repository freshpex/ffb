import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  FaBell, 
  FaArrowRight, 
  FaCheck, 
  FaTrash, 
  FaCheckDouble 
} from 'react-icons/fa';
import { 
  selectNotifications, 
  selectUnreadNotificationsCount,
  markNotificationAsRead,
  clearNotification,
  markAllNotificationsAsRead,
  selectDashboardComponentStatus
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPanel = ({ maxItems, showViewAll }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadNotificationsCount);
  const componentStatus = useSelector(state => 
    selectDashboardComponentStatus(state, 'notifications')
  );
  
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };
  
  const handleClear = (id) => {
    dispatch(clearNotification(id));
  };
  
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };
  
  // Helper to get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <div className="p-2 bg-green-900/30 text-green-500 rounded-full"><FaCheck size={14} /></div>;
      case 'warning':
        return <div className="p-2 bg-yellow-900/30 text-yellow-500 rounded-full"><FaBell size={14} /></div>;
      case 'error':
        return <div className="p-2 bg-red-900/30 text-red-500 rounded-full"><FaTrash size={14} /></div>;
      case 'info':
      default:
        return <div className="p-2 bg-blue-900/30 text-blue-500 rounded-full"><FaBell size={14} /></div>;
    }
  };
  
  // If the component is loading, show a skeleton loader
  if (componentStatus === 'loading') {
    return <CardLoader title="Notifications" height="h-80" />;
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-100">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-gray-400 hover:text-gray-200 p-1"
              title="Mark all as read"
            >
              <FaCheckDouble size={14} />
            </button>
          )}
          
          {showViewAll && (
            <button 
              onClick={() => navigate('/login/notifications')}
              className="text-primary-500 text-sm flex items-center hover:text-primary-400"
            >
              View All <FaArrowRight className="ml-1" size={12} />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.slice(0, maxItems).map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg border ${
                notification.read ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-700/50 border-gray-600'
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium text-sm ${notification.read ? 'text-gray-300' : 'text-gray-100'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-200 p-1"
                          title="Mark as read"
                        >
                          <FaCheck size={12} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleClear(notification.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove notification"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-700/30 p-4 rounded-lg text-center h-32 flex flex-col items-center justify-center">
            <FaBell className="text-gray-500 mb-2" size={24} />
            <p className="text-gray-400">No notifications</p>
            <p className="text-xs text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

NotificationsPanel.propTypes = {
  maxItems: PropTypes.number,
  showViewAll: PropTypes.bool
};

NotificationsPanel.defaultProps = {
  maxItems: 5,
  showViewAll: false
};

export default NotificationsPanel;
