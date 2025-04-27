import PropTypes from "prop-types";
import {
  FaBell,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const NotificationItem = ({ notification, onRead, onDelete }) => {
  const { id, title, message, type, read, timestamp } = notification;

  const icons = {
    info: <FaInfoCircle className="text-blue-500" />,
    success: <FaCheck className="text-green-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    error: <FaTimes className="text-red-500" />,
    default: <FaBell className="text-gray-400" />,
  };

  const icon = icons[type] || icons.default;
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <div
      className={`px-4 py-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${read ? "opacity-60" : ""}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium text-gray-200">{title}</h4>
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{message}</p>
          <div className="flex justify-end mt-2 space-x-2">
            {!read && (
              <button
                onClick={() => onRead(id)}
                className="text-xs text-gray-400 hover:text-primary-500"
              >
                Mark as read
              </button>
            )}
            <button
              onClick={() => onDelete(id)}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["info", "success", "warning", "error", "default"]),
    read: PropTypes.bool.isRequired,
    timestamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]).isRequired,
  }).isRequired,
  onRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NotificationItem;
