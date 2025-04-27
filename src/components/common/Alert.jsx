import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaCheck, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

const Alert = ({ type = "info", message, onDismiss }) => {
  if (!message) return null;

  const alertClasses = {
    success: "bg-green-900/30 text-green-400 border-green-500",
    error: "bg-red-900/30 text-red-400 border-red-500",
    info: "bg-blue-900/30 text-blue-400 border-blue-500",
    warning: "bg-yellow-900/30 text-yellow-400 border-yellow-500",
  };

  const icons = {
    success: <FaCheck />,
    error: <FaExclamationCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationCircle />,
  };

  return (
    <motion.div
      className={`mb-6 px-4 py-3 border rounded-md flex items-center ${alertClasses[type]}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <span className="mr-3 text-lg">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-gray-300 hover:text-white focus:outline-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error", "info", "warning"]),
  message: PropTypes.string,
  onDismiss: PropTypes.func,
};

export default Alert;
