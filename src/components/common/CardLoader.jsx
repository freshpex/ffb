import PropTypes from 'prop-types';
import { useDarkMode } from "../../context/DarkModeContext";

const CardLoader = ({ title, height }) => {
  const { darkMode } = useDarkMode();
  
  return (
    <div className={`${
      darkMode 
        ? 'bg-gray-800 shadow-none' 
        : 'bg-white shadow'
    } rounded-lg p-4 ${height} animate-pulse`}>
      <div className="flex justify-between items-center mb-6">
        <div className={`h-6 w-1/3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
        <div className={`h-4 w-1/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
      </div>
      
      <div className="space-y-4">
        <div className={`h-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
          <div className={`h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
          <div className={`h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
          <div className={`h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
        </div>
      </div>
    </div>
  );
};

CardLoader.propTypes = {
  title: PropTypes.string,
  height: PropTypes.string
};

CardLoader.defaultProps = {
  title: 'Loading...',
  height: 'h-64'
};

export default CardLoader;
