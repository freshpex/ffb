import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Loader = ({ fullScreen = true, size = "default", text = "Loading..." }) => {
  // Define sizes for the loader
  const sizes = {
    small: "w-8 h-8",
    default: "w-16 h-16",
    large: "w-24 h-24"
  };

  // Animation for spinner
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  // Define content based on the chosen size
  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
      {text && <p className="mt-4 text-gray-300 font-medium">{text}</p>}
    </div>
  );

  // If fullScreen, render with a full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/90 z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  // Otherwise, render without the overlay
  return loaderContent;
};

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
  text: PropTypes.string
};

export default Loader;
