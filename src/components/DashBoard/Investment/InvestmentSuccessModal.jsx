import { useDispatch, useSelector } from "react-redux";
import {
  selectSuccessModal,
  closeSuccessModal,
} from "../../../redux/slices/investmentSlice";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const InvestmentSuccessModal = () => {
  const dispatch = useDispatch();
  const successModal = useSelector(selectSuccessModal);

  if (!successModal.isOpen) return null;

  const handleClose = () => {
    dispatch(closeSuccessModal());
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <motion.div
            className="relative w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-end">
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="text-center mt-2 mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <FaCheckCircle size={36} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-100 mb-2">
                    Investment Successful!
                  </h2>
                  <p className="text-gray-400">
                    Your investment of{" "}
                    <span className="text-gray-200 font-medium">
                      ${successModal.investmentData?.amount?.toLocaleString()}
                    </span>{" "}
                    in
                    <span className="text-primary-500 font-medium">
                      {" "}
                      {successModal.investmentData?.planName}
                    </span>{" "}
                    has been created.
                  </p>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Investment ID:</span>
                    <span className="font-medium">
                      {successModal.investmentData?.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Status:</span>
                    <span className="text-yellow-500 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Expected Return:</span>
                    <span className="text-green-500 font-medium">
                      $
                      {(
                        successModal.investmentData?.amount *
                        (successModal.investmentData?.returnRate / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Maturity Date:</span>
                    <span className="font-medium">
                      {successModal.investmentData?.endDate
                        ? new Date(
                            successModal.investmentData.endDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View My Investments
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InvestmentSuccessModal;
