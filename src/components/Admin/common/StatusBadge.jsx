import PropTypes from 'prop-types';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaTimesCircle, 
  FaBan, 
  FaSpinner, 
  FaClock 
} from 'react-icons/fa';

const StatusBadge = ({ status, withIcon = true, size = 'default' }) => {
  // Define status types and their styles
  const statusConfig = {
    // Green statuses - positive outcomes
    active: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-400',
      icon: <FaCheckCircle />
    },
    completed: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-400',
      icon: <FaCheckCircle />
    },
    approved: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-400',
      icon: <FaCheckCircle />
    },
    success: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-400',
      icon: <FaCheckCircle />
    },
    resolved: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-400',
      icon: <FaCheckCircle />
    },
    closed: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-400',
      icon: <FaCheckCircle />
    },
    
    // Yellow statuses - in progress or pending
    pending: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-400',
      icon: <FaClock />
    },
    in_progress: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-400',
      icon: <FaSpinner />
    },
    processing: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-400',
      icon: <FaSpinner />
    },
    waiting: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-400',
      icon: <FaClock />
    },
    waiting_for_documents: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-400',
      icon: <FaClock />
    },
    responded: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-400',
      icon: <FaCheckCircle />
    },
    
    // Red statuses - negative outcomes
    rejected: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-800 dark:text-red-400',
      icon: <FaTimesCircle />
    },
    failed: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-800 dark:text-red-400',
      icon: <FaTimesCircle />
    },
    cancelled: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-800 dark:text-red-400',
      icon: <FaTimesCircle />
    },
    suspended: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-800 dark:text-red-400',
      icon: <FaBan />
    },
    
    // Grey/neutral statuses
    inactive: { 
      bg: 'bg-gray-100 dark:bg-gray-700', 
      text: 'text-gray-800 dark:text-gray-300',
      icon: <FaTimesCircle />
    },
    default: { 
      bg: 'bg-gray-100 dark:bg-gray-700', 
      text: 'text-gray-800 dark:text-gray-300',
      icon: <FaExclamationCircle />
    }
  };
  
  // Get configuration for this status, or use default if not found
  const config = statusConfig[status.toLowerCase()] || statusConfig.default;
  
  // Determine size classes
  const sizeClasses = {
    small: 'px-1.5 py-0.5 text-xs',
    default: 'px-2 py-1 text-xs',
    large: 'px-2.5 py-1.5 text-sm'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.default;
  
  // Format the status text for display (convert snake_case to Title Case)
  const formattedStatus = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <span className={`inline-flex items-center rounded-full ${config.bg} ${config.text} ${sizeClass} font-medium`}>
      {withIcon && (
        <span className="mr-1.5 text-xs">{config.icon}</span>
      )}
      {formattedStatus}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  withIcon: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large'])
};

export default StatusBadge;
