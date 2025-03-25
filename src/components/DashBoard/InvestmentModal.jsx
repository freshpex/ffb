import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { FaTimes, FaInfoCircle, FaMoneyBillWave, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { makeInvestment, selectInvestmentStatus } from "../../redux/slices/investmentSlice";

const InvestmentModal = ({ isOpen, onClose, plan }) => {
  const dispatch = useDispatch();
  const investmentStatus = useSelector(selectInvestmentStatus);
  
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  
  // Reset form when plan changes
  useEffect(() => {
    if (plan) {
      setAmount(plan.minAmount.toString());
      setError("");
    }
  }, [plan]);
  
  if (!plan) return null;
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError("");
  };
  
  const validateForm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError("Please enter a valid amount");
      return false;
    }
    
    if (numAmount < plan.minAmount) {
      setError(`Minimum investment amount is ${formatCurrency(plan.minAmount)}`);
      return false;
    }
    
    if (plan.maxAmount && numAmount > plan.maxAmount) {
      setError(`Maximum investment amount is ${formatCurrency(plan.maxAmount)}`);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await dispatch(makeInvestment(plan.id, amount));
      // The success will be handled by a modal shown from parent component
    } catch (err) {
      setError(err.message || 'Failed to process investment');
    }
  };
  
  // Calculate expected return
  const calculateReturn = () => {
    const investmentAmount = parseFloat(amount) || 0;
    const expectedReturn = investmentAmount * (plan.roi / 100);
    return expectedReturn;
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
            className="bg-gray-800 rounded-lg w-full max-w-lg overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Invest in {plan.name}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <Alert 
                  type="error" 
                  message={error}
                  onDismiss={() => setError("")}
                  className="mb-4"
                />
              )}
              
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <FaInfoCircle className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">
                    You are about to invest in our {plan.name}. Please specify the amount you wish to invest
                    and review the details below before confirming.
                  </p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <FaChartLine className="text-green-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">ROI</p>
                        <p className="text-white font-medium">{plan.roi}%</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="text-white font-medium">{plan.duration} days</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-amber-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Min Investment</p>
                        <p className="text-white font-medium">{formatCurrency(plan.minAmount)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-amber-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Max Investment</p>
                        <p className="text-white font-medium">
                          {plan.maxAmount ? formatCurrency(plan.maxAmount) : 'Unlimited'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Investment Amount ($)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      placeholder="Enter amount to invest"
                      min={plan.minAmount}
                      max={plan.maxAmount || undefined}
                      step="100"
                      required
                    />
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 mb-6">
                    <h4 className="text-white font-medium mb-3">Investment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Investment Amount:</span>
                        <span className="text-white font-medium">
                          {amount ? formatCurrency(parseFloat(amount)) : '$0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Return (ROI):</span>
                        <span className="text-green-400 font-medium">
                          {formatCurrency(calculateReturn())}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-700">
                        <span className="text-gray-400">Total at maturity:</span>
                        <span className="text-white font-medium">
                          {amount ? formatCurrency(parseFloat(amount) + calculateReturn()) : '$0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      isLoading={investmentStatus === 'loading'}
                      disabled={investmentStatus === 'loading'}
                    >
                      Confirm Investment
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

InvestmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    minAmount: PropTypes.number.isRequired,
    maxAmount: PropTypes.number,
    roi: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  })
};

export default InvestmentModal;
