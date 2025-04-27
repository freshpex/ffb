import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import HomeFooter from "../pages/LandingPage/HomeFooter";
import Header from "../pages/LandingPage/Header";

const ErrorPage = ({ code = 404, message = "Page not found" }) => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#131920] to-[#2a3646]">
        <motion.div
          className="text-center p-12 bg-white/10 rounded-2xl backdrop-blur-md shadow-2xl max-w-[500px] w-[90%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-[#f9a23f] mb-8 text-5xl">
            <FaExclamationTriangle />
          </div>
          <h1 className="text-5xl text-[#f9a23f] mb-4">{code}</h1>
          <h2 className="text-2xl text-[#f9a23f] mb-4">{message}</h2>
          <p className="text-lg text-white mb-8">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-[#f9a23f] text-white py-4 px-6 rounded-full min-w-[200px] text-base font-bold hover:bg-[#131920] hover:border-2 hover:border-[#f9a23f] transition-all duration-300"
            >
              <FaHome /> Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#f9a23f] text-white py-4 px-6 rounded-full min-w-[200px] text-base font-bold hover:bg-[#131920] transition-all duration-300"
            >
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
      <HomeFooter />
    </>
  );
};

export default ErrorPage;
