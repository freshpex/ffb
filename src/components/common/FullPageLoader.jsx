import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

const FullPageLoader = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <svg
            className="w-16 h-16 text-primary-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
        <p
          className={`mt-4 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Loading...
        </p>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
};

export default FullPageLoader;
