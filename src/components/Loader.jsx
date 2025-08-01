import React from "react";
import { memo } from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext";

const Loader = memo(() => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen ${
        darkMode
          ? "bg-gradient-to-br from-[#131920] to-[#2a3646]"
          : "bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb]"
      }`}
    >
      <div>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill={darkMode ? "#f9a231" : "#4b5563"}
          height="250"
          width="200"
          viewBox="0 0 512 512"
          animate={{
            rotate: [0, 0, 0, 0, 0],
            scale: [1, 1.1, 1.1, 1, 1],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 0.3,
          }}
        >
          <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z" />
        </motion.svg>
      </div>
      <motion.h2
        className={`${
          darkMode ? "text-white" : "text-gray-800"
        } text-2xl font-bold mt-4`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        Fidelity First Brokers
      </motion.h2>
    </div>
  );
});

Loader.displayName = "MainLoader";

export default Loader;
