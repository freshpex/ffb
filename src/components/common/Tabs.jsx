import PropTypes from 'prop-types';

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex flex-wrap border-b border-gray-700 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`py-3 px-4 font-medium text-sm flex items-center transition-colors mr-2 -mb-px
            ${activeTab === tab.id 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-400 hover:text-gray-300'
            }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
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
      icon: PropTypes.node
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Tabs;
