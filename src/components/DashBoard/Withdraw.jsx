import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaMoneyBillWave, 
  FaBitcoin, 
  FaEthereum, 
  FaUniversity,
  FaExclamationCircle,
  FaInfoCircle,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { 
  submitWithdrawal,
  selectWithdrawalLimits,
  selectWithdrawalStatus,
  selectWithdrawalError,
  selectPendingWithdrawal
} from "../../redux/slices/withdrawalSlice";
import { selectUserPaymentMethods } from "../../redux/slices/userSlice";

const Withdraw = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const withdrawalLimits = useSelector(selectWithdrawalLimits);
  const withdrawalStatus = useSelector(selectWithdrawalStatus);
  const withdrawalError = useSelector(selectWithdrawalError);
  const pendingWithdrawal = useSelector(selectPendingWithdrawal);
  const savedPaymentMethods = useSelector(selectUserPaymentMethods);
  
  // Local state
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    address: "",
    saveMethod: false
  });
  const [errors, setErrors] = useState({});
  const [useExisting, setUseExisting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Clear alerts after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  // Reset confirmation when pending withdrawal changes
  useEffect(() => {
    if (pendingWithdrawal) {
      setShowConfirmation(true);
    }
  }, [pendingWithdrawal]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    
    // Clear the related error when the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  const handleSelectPaymentMethod = (method) => {
    setFormData({
      ...formData,
      method: method.type,
      address: method.address
    });
    setUseExisting(true);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (parseFloat(formData.amount) < withdrawalLimits.minimum) {
      newErrors.amount = `Minimum withdrawal amount is $${withdrawalLimits.minimum}`;
    } else if (parseFloat(formData.amount) > withdrawalLimits.remainingDaily) {
      newErrors.amount = `Exceeds your daily withdrawal limit of $${withdrawalLimits.remainingDaily}`;
    }
    
    // Method validation
    if (!formData.method) {
      newErrors.method = "Please select a withdrawal method";
    }
    
    // Address validation
    if (!formData.address) {
      newErrors.address = "Withdrawal address is required";
    } else if (formData.method === "bitcoin" && !formData.address.startsWith("bc1") && !formData.address.startsWith("1") && !formData.address.startsWith("3")) {
      newErrors.address = "Invalid Bitcoin address";
    } else if (formData.method === "ethereum" && !formData.address.startsWith("0x")) {
      newErrors.address = "Invalid Ethereum address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await dispatch(submitWithdrawal({
        amount: formData.amount,
        method: formData.method,
        address: formData.address,
        saveMethod: formData.saveMethod
      }));
      
      // Success will be handled by useEffect when pendingWithdrawal is updated
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to process withdrawal"
      });
    }
  };
  
  const handleViewTransactions = () => {
    navigate('/login/withdrawtransaction');
  };
  
  const getMethodIcon = (methodType) => {
    switch (methodType) {
      case 'bitcoin':
        return <FaBitcoin className="text-yellow-500" />;
      case 'ethereum':
        return <FaEthereum className="text-blue-400" />;
      case 'bank':
        return <FaUniversity className="text-gray-400" />;
      default:
        return <FaMoneyBillWave className="text-green-500" />;
    }
  };
  
  const renderWithdrawalSuccess = () => {
    if (!pendingWithdrawal) return null;
    
    return (
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          <div className="mb-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Withdrawal Submitted</h3>
            <p className="text-gray-400">Your withdrawal request has been successfully submitted.</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-medium">${pendingWithdrawal.amount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Fee:</span>
              <span className="text-white font-medium">${pendingWithdrawal.fee}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-medium">${pendingWithdrawal.total}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Method:</span>
              <span className="text-white font-medium flex items-center">
                {getMethodIcon(pendingWithdrawal.method.toLowerCase())}
                <span className="ml-2">{pendingWithdrawal.method}</span>
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Status:</span>
              <span className="text-yellow-400 font-medium">{pendingWithdrawal.status}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="outline" 
              fullWidth 
              onClick={() => setShowConfirmation(false)}
            >
              Close
            </Button>
            <Button 
              type="button" 
              fullWidth 
              onClick={handleViewTransactions}
            >
              View Transactions
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  if (showConfirmation && pendingWithdrawal) {
    return (
      <DashboardLayout>
        {renderWithdrawalSuccess()}
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Withdraw Funds
        </h1>
        
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {alert && (
              <Alert 
                type={alert.type} 
                message={alert.message}
                onDismiss={() => setAlert(null)}
              />
            )}
            
            {/* Withdrawal Limits Info Box */}
            <div className="mb-6 bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <FaInfoCircle className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-2">Withdrawal Limits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Minimum Withdrawal</p>
                      <p className="text-white font-medium">${withdrawalLimits.minimum}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Daily Limit Remaining</p>
                      <p className="text-white font-medium">${withdrawalLimits.remainingDaily}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Monthly Limit Remaining</p>
                      <p className="text-white font-medium">${withdrawalLimits.remainingMonthly}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {savedPaymentMethods.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Saved Payment Methods</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPaymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`bg-gray-800 p-4 rounded-lg border-2 cursor-pointer transition-colors
                        ${formData.method === method.type && formData.address === method.address 
                          ? 'border-primary-500' 
                          : 'border-gray-700 hover:border-gray-600'
                        }`}
                      onClick={() => handleSelectPaymentMethod(method)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {getMethodIcon(method.type)}
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">{method.type}</p>
                          <p className="text-gray-400 text-sm truncate">
                            {method.address.substring(0, 8)}...{method.address.substring(method.address.length - 8)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="flex-grow border-t border-gray-700"></div>
                  <p className="px-4 text-sm text-gray-400">Or enter details manually</p>
                  <div className="flex-grow border-t border-gray-700"></div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormInput
                label="Withdrawal Amount ($)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount to withdraw"
                error={errors.amount}
                required
              />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Withdrawal Method
                  {errors.method && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label className={`
                    flex flex-col items-center p-3 border rounded-lg cursor-pointer
                    ${formData.method === 'bitcoin' 
                      ? 'border-primary-500 bg-primary-900/20' 
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                    }
                  `}>
                    <input
                      type="radio"
                      name="method"
                      value="bitcoin"
                      checked={formData.method === 'bitcoin'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <FaBitcoin className="text-2xl mb-2 text-yellow-500" />
                    <span className="text-sm">Bitcoin</span>
                  </label>
                  
                  <label className={`
                    flex flex-col items-center p-3 border rounded-lg cursor-pointer
                    ${formData.method === 'ethereum' 
                      ? 'border-primary-500 bg-primary-900/20' 
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                    }
                  `}>
                    <input
                      type="radio"
                      name="method"
                      value="ethereum"
                      checked={formData.method === 'ethereum'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <FaEthereum className="text-2xl mb-2 text-blue-400" />
                    <span className="text-sm">Ethereum</span>
                  </label>
                  
                  <label className={`
                    flex flex-col items-center p-3 border rounded-lg cursor-pointer
                    ${formData.method === 'bank' 
                      ? 'border-primary-500 bg-primary-900/20' 
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                    }
                  `}>
                    <input
                      type="radio"
                      name="method"
                      value="bank"
                      checked={formData.method === 'bank'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <FaUniversity className="text-2xl mb-2 text-gray-300" />
                    <span className="text-sm">Bank Transfer</span>
                  </label>
                </div>
                {errors.method && (
                  <p className="mt-1 text-xs text-red-500">{errors.method}</p>
                )}
              </div>
              
              <FormInput
                label={`${formData.method ? 
                  (formData.method === 'bitcoin' ? 'Bitcoin Address' : 
                  formData.method === 'ethereum' ? 'Ethereum Address' : 
                  'Bank Account Number') : 'Withdrawal Address'}`}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={`Enter your ${formData.method || 'withdrawal'} address`}
                error={errors.address}
                disabled={useExisting}
                required
              />
              
              {!useExisting && (
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="saveMethod"
                    name="saveMethod"
                    checked={formData.saveMethod}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="saveMethod" className="ml-2 text-sm text-gray-300">
                    Save this payment method for future withdrawals
                  </label>
                </div>
              )}
              
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h4 className="text-white font-medium mb-3">Withdrawal Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">${formData.amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee (1%):</span>
                    <span className="text-white">${formData.amount ? (parseFloat(formData.amount) * 0.01).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400">You will receive:</span>
                    <span className="text-white font-medium">
                      ${formData.amount ? (parseFloat(formData.amount) * 0.99).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleViewTransactions}
                >
                  View Withdrawal History
                </Button>
                <Button 
                  type="submit" 
                  isLoading={withdrawalStatus === 'loading'}
                  disabled={withdrawalStatus === 'loading'}
                >
                  <FaArrowRight className="mr-2" /> Submit Withdrawal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
      
      {/* Show success modal if we have a pending withdrawal */}
      {showConfirmation && renderWithdrawalSuccess()}
    </DashboardLayout>
  );
};

export default Withdraw;
