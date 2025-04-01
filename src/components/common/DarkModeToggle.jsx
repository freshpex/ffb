import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useDarkMode } from '../../context/DarkModeContext';

const DarkModeToggle = ({ className = '', size = 'default' }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  const sizes = {
    small: {
      button: 'h-8 w-8',
      icon: 'text-sm'
    },
    default: {
      button: 'h-10 w-10',
      icon: 'text-base'
    },
    large: {
      button: 'h-12 w-12',
      icon: 'text-lg'
    },
  };
  
  const currentSize = sizes[size] || sizes.default;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className={`${currentSize.button} rounded-full flex items-center justify-center transition-colors ${
        darkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className={currentSize.icon} />
      ) : (
        <FaMoon className={currentSize.icon} />
      )}
    </motion.button>
  );
};

DarkModeToggle.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large'])
};

export default DarkModeToggle;
