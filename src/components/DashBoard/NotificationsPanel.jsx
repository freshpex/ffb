import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import NotificationItem from '../common/NotificationItem';
import { 
  selectNotifications, 
  markNotificationAsRead, 
  clearAllNotifications 
} from '../../redux/slices/layoutSlice';

const NotificationsPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };
  
  const handleDelete = (id) => {
    // You could add a specific action for deleting a single notification
    // For now, we'll use the existing markAsRead action as an example
    dispatch(markNotificationAsRead(id));
  };
  
  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };
  
  return (
    <motion.div 
      className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-200 flex items-center">
          <FaBell className="mr-2 text-primary-500" /> Notifications
        </h3>
        {notifications.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-xs text-gray-400 hover:text-primary-500"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem 
              key={notification.id}
              notification={notification}
              onRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 mb-4">
              <FaBell size={20} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-400">No notifications yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;
