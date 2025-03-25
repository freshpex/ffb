import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const InfoCard = ({ icon, title, value, subtitle, color = 'blue', delay = 0 }) => {
  // Map color prop to specific Tailwind classes
  const getBgColorClass = () => {
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
      className="bg-gray-800 rounded-lg p-5 shadow-lg flex items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className={`w-12 h-12 rounded-full ${getBgColorClass()} flex items-center justify-center mr-4 ${getTextColorClass()}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  color: PropTypes.string,
  delay: PropTypes.number
};

export default InfoCard;
