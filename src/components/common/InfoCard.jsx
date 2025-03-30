import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const InfoCard = ({ icon, title, message, type, action }) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/30 text-green-400';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400';
      case 'error':
        return 'bg-red-900/20 border-red-500/30 text-red-400';
      case 'info':
      default:
        return 'bg-blue-900/20 border-blue-500/30 text-blue-400';
    }
  };

  return (
    <motion.div
      className={`p-6 rounded-lg border ${getTypeClasses()} flex flex-col items-center text-center`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-bold mb-2 text-gray-100">{title}</h3>
      <p className="text-gray-300 mb-4">{message}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })
};

InfoCard.defaultProps = {
  type: 'info',
  action: null
};

export default InfoCard;
