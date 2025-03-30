import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";

const ComponentLoader = ({ height = "200px", message = "Loading...", type = "default" }) => {
  // Different loader styles for different components
  const loaderTypes = {
    default: {
      bg: "bg-gray-800",
      textColor: "text-gray-300",
      spinner: "text-primary-500",
    },
    card: {
      bg: "bg-gray-800",
      textColor: "text-gray-300",
      spinner: "text-primary-500",
    },
    chart: {
      bg: "bg-gray-800/50",
      textColor: "text-gray-400",
      spinner: "text-primary-400",
    },
    table: {
      bg: "bg-gray-800/70",
      textColor: "text-gray-400",
      spinner: "text-primary-400",
    }
  };

  const style = loaderTypes[type];

  return (
    <motion.div
      className={`w-full rounded-lg ${style.bg} shadow-md flex flex-col items-center justify-center overflow-hidden`}
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-3"
      >
        <FaSpinner className={`text-3xl ${style.spinner}`} />
      </motion.div>
      <p className={`${style.textColor} text-sm`}>{message}</p>
    </motion.div>
  );
};

ComponentLoader.propTypes = {
  height: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["default", "card", "chart", "table"])
};

export default ComponentLoader;
