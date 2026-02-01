import { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaBan } from "react-icons/fa";
import { selectUserProfile } from "../../redux/slices/userSlice";

const AccountSuspensionModal = () => {
  const profile = useSelector(selectUserProfile);

  const isSuspended = profile?.status === "suspended";
  const isInactive = profile?.status === "inactive";
  const showModal = isSuspended || isInactive;

  useEffect(() => {
    // If account is suspended/inactive, prevent any navigation
    if (showModal) {
      // Block browser back button
      const handlePopState = (e) => {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
      };

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [showModal]);

  if (!showModal) return null;

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("ffb_auth_token");
    sessionStorage.removeItem("ffb_auth_token");
    localStorage.removeItem("ffb_user");
    
    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
        style={{ pointerEvents: "all" }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border-2 border-red-500/50 overflow-hidden"
        >
          {/* Header with icon */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
              {isSuspended ? (
                <FaBan className="text-5xl text-white" />
              ) : (
                <FaExclamationTriangle className="text-5xl text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isSuspended ? "Account Suspended" : "Account Inactive"}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {isSuspended && (
              <>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <FaExclamationTriangle />
                    Fraudulent Activity Detected
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Your account has been flagged and suspended due to suspicious
                    or fraudulent activities that violate our terms of service.
                  </p>
                </div>

                <div className="space-y-2 text-gray-300 text-sm">
                  <p className="font-medium text-white">What this means:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>All account access has been restricted</li>
                    <li>Trading and transactions are disabled</li>
                    <li>Your account is under review</li>
                  </ul>
                </div>
              </>
            )}

            {isInactive && (
              <>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-400 font-semibold mb-2">
                    Account Deactivated
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Your account is currently inactive. This may be due to
                    administrative action or account verification requirements.
                  </p>
                </div>
              </>
            )}

            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <p className="text-white font-medium mb-2">Next Steps:</p>
              <p className="text-gray-300 text-sm">
                Please contact our support team to resolve this issue and restore
                your account access. Include your account email and any relevant
                details.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <a
                href="mailto:support@fidelityfirstbrokers.com"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Contact Support
              </a>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center pt-2">
              Support Email: support@ffbroker.cam
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountSuspensionModal;
