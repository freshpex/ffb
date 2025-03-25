import PropTypes from 'prop-types';
import { 
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaBan,
  FaInfoCircle
} from 'react-icons/fa';

const TransactionStatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      color: 'bg-green-500/20 text-green-400',
      icon: <FaCheckCircle className="mr-1.5" />
    },
    pending: {
      color: 'bg-yellow-500/20 text-yellow-400',
      icon: <FaHourglassHalf className="mr-1.5" />
    },
    failed: {
      color: 'bg-red-500/20 text-red-400',
      icon: <FaTimesCircle className="mr-1.5" />
    },
    cancelled: {
      color: 'bg-gray-500/20 text-gray-400',
      icon: <FaBan className="mr-1.5" />
    },
    processing: {
      color: 'bg-blue-500/20 text-blue-400',
      icon: <FaInfoCircle className="mr-1.5" />
    }
  };

  const { color, icon } = statusConfig[status.toLowerCase()] || statusConfig.processing;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-fit ${color}`}>
      {icon} {status}
    </span>
  );
};

TransactionStatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default TransactionStatusBadge;
