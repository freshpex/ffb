import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { FaCheckCircle, FaChartLine } from "react-icons/fa";
import Button from "../common/Button";

const InvestmentSuccessModal = ({ isOpen, onClose, investment }) => {
  if (!investment) return null;
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Investment Successful!</h3>
                <p className="text-gray-300">
                  Your investment has been successfully placed in the {investment.planName}.
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium flex items-center mb-3">
                  <FaChartLine className="text-primary-500 mr-2" /> 
                  Investment Details
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Investment ID:</span>
                    <span className="text-white">{investment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan:</span>
                    <span className="text-white">{investment.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">{formatCurrency(investment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROI:</span>
                    <span className="text-white">{investment.roi}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{investment.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">{formatDate(investment.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">End Date:</span>
                    <span className="text-white">{formatDate(investment.endDate)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-700">
                    <span className="text-gray-400">Expected Return:</span>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(investment.amount * (investment.roi / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total at Maturity:</span>
                    <span className="text-white font-medium">
                      {formatCurrency(investment.amount * (1 + investment.roi / 100))}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={onClose}
                fullWidth
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

InvestmentSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  investment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    planId: PropTypes.string.isRequired,
    planName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    roi: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    endDate: PropTypes.string.isRequired
  })
};

export default InvestmentSuccessModal;
