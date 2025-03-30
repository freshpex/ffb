import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap border-b border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`relative px-4 sm:px-6 py-2 flex items-center whitespace-nowrap text-sm sm:text-base ${
            activeTab === tab.id
              ? 'text-primary-500'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="flex items-center space-x-2">
            {tab.icon && <span>{tab.icon}</span>}
            <span className="font-medium">{tab.label}</span>
            
            {tab.count !== undefined && (
              <span className={`ml-2 flex items-center justify-center text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id 
                  ? 'bg-primary-500/20 text-primary-400' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {tab.count}
              </span>
            )}
          </div>
          
          {activeTab === tab.id && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
              layoutId="tabIndicator"
              initial={false}
            />
          )}
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      count: PropTypes.number
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default Tabs;
