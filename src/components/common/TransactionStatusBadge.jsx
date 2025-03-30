import PropTypes from 'prop-types';
import { 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaTimesCircle, 
  FaBan,
  FaInfoCircle
} from 'react-icons/fa';

const TransactionStatusBadge = ({ status }) => {
  let badgeClass = '';
  let Icon = FaInfoCircle;
  let text = status;

  switch (status.toLowerCase()) {
    case 'completed':
      badgeClass = 'bg-green-900/30 text-green-500 border-green-500';
      Icon = FaCheckCircle;
      break;
    case 'pending':
      badgeClass = 'bg-yellow-900/30 text-yellow-500 border-yellow-500';
      Icon = FaHourglassHalf;
      break;
    case 'failed':
      badgeClass = 'bg-red-900/30 text-red-500 border-red-500';
      Icon = FaTimesCircle;
      break;
    case 'rejected':
      badgeClass = 'bg-red-900/30 text-red-500 border-red-500';
      Icon = FaTimesCircle;
      text = 'Rejected';
      break;
    case 'cancelled':
    case 'canceled':
      badgeClass = 'bg-gray-900/30 text-gray-500 border-gray-500';
      Icon = FaBan;
      text = 'Cancelled';
      break;
    default:
      badgeClass = 'bg-gray-900/30 text-gray-500 border-gray-500';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
      <Icon className="mr-1" size={12} />
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </span>
  );
};

TransactionStatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default TransactionStatusBadge;
