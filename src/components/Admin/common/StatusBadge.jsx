import React from 'react';
import PropTypes from 'prop-types';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaTimesCircle, 
  FaBan, 
  FaSpinner, 
  FaClock 
} from 'react-icons/fa';

const StatusBadge = ({ status, type = 'default', size = 'medium' }) => {
  // Define color schemes for different status types
  const getColorScheme = () => {
    const colorSchemes = {
      default: {
        completed: 'bg-green-100 text-green-800 border-green-200',
        success: 'bg-green-100 text-green-800 border-green-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        active: 'bg-green-100 text-green-800 border-green-200',
        
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        reviewing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        
        failed: 'bg-red-100 text-red-800 border-red-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        expired: 'bg-red-100 text-red-800 border-red-200',
        
        inactive: 'bg-gray-100 text-gray-800 border-gray-200',
        closed: 'bg-gray-100 text-gray-800 border-gray-200'
      },
      dark: {
        completed: 'bg-green-900/30 text-green-400 border-green-800',
        success: 'bg-green-900/30 text-green-400 border-green-800',
        approved: 'bg-green-900/30 text-green-400 border-green-800',
        active: 'bg-green-900/30 text-green-400 border-green-800',
        
        pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
        processing: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
        reviewing: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
        
        failed: 'bg-red-900/30 text-red-400 border-red-800',
        rejected: 'bg-red-900/30 text-red-400 border-red-800',
        cancelled: 'bg-red-900/30 text-red-400 border-red-800',
        expired: 'bg-red-900/30 text-red-400 border-red-800',
        
        inactive: 'bg-gray-800 text-gray-400 border-gray-700',
        closed: 'bg-gray-800 text-gray-400 border-gray-700'
      },
      outline: {
        completed: 'border-green-500 text-green-500',
        success: 'border-green-500 text-green-500',
        approved: 'border-green-500 text-green-500',
        active: 'border-green-500 text-green-500',
        
        pending: 'border-yellow-500 text-yellow-500',
        processing: 'border-yellow-500 text-yellow-500',
        reviewing: 'border-yellow-500 text-yellow-500',
        
        failed: 'border-red-500 text-red-500',
        rejected: 'border-red-500 text-red-500',
        cancelled: 'border-red-500 text-red-500',
        expired: 'border-red-500 text-red-500',
        
        inactive: 'border-gray-500 text-gray-500',
        closed: 'border-gray-500 text-gray-500'
      }
    };
    
    // Return default colors if status isn't explicitly defined
    return colorSchemes[type][status.toLowerCase()] || colorSchemes[type].pending;
  };
  
  // Size classes
  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    medium: 'text-xs px-2 py-1',
    large: 'text-sm px-2.5 py-1.5'
  };
  
  // Format status text (capitalize first letter)
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  
  return (
    <span className={`inline-flex items-center rounded border ${getColorScheme()} ${sizeClasses[size]} font-medium`}>
      {formattedStatus}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['default', 'dark', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default StatusBadge;
