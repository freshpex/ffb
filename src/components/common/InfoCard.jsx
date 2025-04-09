import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const InfoCard = ({ icon, title, value, message, subtitle, color = 'blue', delay = 0, type }) => {
  // Map color prop to specific Tailwind classes
  const getBgColorClass = () => {
    if (type === 'error') return 'bg-red-500/20';
    if (type === 'warning') return 'bg-amber-500/20';
    if (type === 'success') return 'bg-green-500/20';
    if (type === 'info') return 'bg-blue-500/20';
    
    switch (color) {
      case 'blue': return 'bg-blue-500/20';
      case 'green': return 'bg-green-500/20';
      case 'amber': return 'bg-amber-500/20';
      case 'purple': return 'bg-purple-500/20';
      case 'red': return 'bg-red-500/20';
      default: return 'bg-primary-500/20';
    }
  };

  const getTextColorClass = () => {
    if (type === 'error') return 'text-red-400';
    if (type === 'warning') return 'text-amber-400';
    if (type === 'success') return 'text-green-400';
    if (type === 'info') return 'text-blue-400';
    
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'amber': return 'text-amber-400';
      case 'purple': return 'text-purple-400';
      case 'red': return 'text-red-400';
      default: return 'text-primary-400';
    }
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg p-5 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center mb-3">
        <div className={`w-12 h-12 rounded-full ${getBgColorClass()} flex items-center justify-center mr-4 ${getTextColorClass()}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      
      {value !== undefined && (
        <div className="text-xl font-bold text-white">{value}</div>
      )}
      
      {message && (
        <p className="text-gray-400 mt-2">{message}</p>
      )}
    </motion.div>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  message: PropTypes.string,
  subtitle: PropTypes.string,
  color: PropTypes.string,
  delay: PropTypes.number,
  type: PropTypes.oneOf(['default', 'error', 'warning', 'success', 'info'])
};

export default InfoCard;
