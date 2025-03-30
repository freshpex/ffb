import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaExclamationTriangle } from "react-icons/fa";
import Button from "./Button";

const ComponentError = ({ 
  height = "200px", 
  message = "Failed to load data", 
  onRetry = null
}) => {
  return (
    <motion.div
      className="w-full rounded-lg bg-gray-800 shadow-md flex flex-col items-center justify-center overflow-hidden"
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FaExclamationTriangle className="text-4xl text-red-500 mb-3" />
      <p className="text-gray-300 text-sm mb-4">{message}</p>
      
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

ComponentError.propTypes = {
  height: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func
};

export default ComponentError;
