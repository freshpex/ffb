import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMoneyBillWave, 
  FaBitcoin, 
  FaEthereum, 
  FaUniversity,
  FaInfoCircle,
  FaArrowRight,
  FaCheckCircle,
  FaHistory,
  FaQrcode
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import FormInput from "../common/FormInput";
import Button from "../common/Button";
import Alert from "../common/Alert";
import QRCode from "../common/QRCode";
import { 
  selectDepositMethods,
  selectActiveMethod,
  selectDepositForm,
  selectDepositStatus,
  selectDepositError,
  selectPendingDeposit,
  setActiveMethod,
  updateDepositForm,
  submitDeposit
} from "../../redux/slices/depositSlice";

const Deposit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const depositMethods = useSelector(selectDepositMethods);
  const activeMethod = useSelector(selectActiveMethod);
  const formData = useSelector(selectDepositForm);
  const depositStatus = useSelector(selectDepositStatus);
  const depositError = useSelector(selectDepositError);
  const pendingDeposit = useSelector(selectPendingDeposit);
  
  // Local state
  const [errors, setErrors] = useState({});
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
  
  // Reset confirmation when pending deposit changes
  useEffect(() => {
    if (pendingDeposit) {
      setShowConfirmation(true);
    }
  }, [pendingDeposit]);
  
  const handleMethodSelect = (methodId) => {
    dispatch(setActiveMethod(methodId));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateDepositForm({ [name]: value }));
    
    // Clear the related error when the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (activeMethod && parseFloat(formData.amount) < activeMethod.minDeposit) {
      newErrors.amount = `Minimum deposit amount is $${activeMethod.minDeposit}`;
    }
    
    // Transaction ID validation for crypto methods
    if ((activeMethod?.id === 'bitcoin' || activeMethod?.id === 'ethereum') && !formData.transactionId) {
      newErrors.transactionId = "Transaction ID is required";
    }
    
    // Reference validation for bank transfers
    if (activeMethod?.id === 'bank' && !formData.reference) {
      newErrors.reference = "Reference number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activeMethod) {
      setAlert({
        type: "error",
        message: "Please select a deposit method"
      });
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      await dispatch(submitDeposit({
        method: activeMethod,
        amount: formData.amount,
        transactionId: formData.transactionId,
        reference: formData.reference
      }));
      
      // Success will be handled by useEffect when pendingDeposit is updated
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to process deposit"
      });
    }
  };
  
  const handleViewTransactions = () => {
    navigate('/login/deposittransaction');
  };
  
  const getMethodIcon = (methodId) => {
    switch (methodId) {
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
  
  const formatCryptoAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 12)}...${address.substring(address.length - 8)}`;
  };
  
  const renderDepositConfirmation = () => {
    if (!pendingDeposit) return null;
    
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
            <h3 className="text-xl font-medium text-white mb-2">Deposit Submitted</h3>
            <p className="text-gray-400">Your deposit request has been successfully submitted.</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-medium">${pendingDeposit.amount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Method:</span>
              <span className="text-white font-medium flex items-center">
                {getMethodIcon(pendingDeposit.method.toLowerCase())}
                <span className="ml-2">{pendingDeposit.method}</span>
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Status:</span>
              <span className="text-yellow-400 font-medium">{pendingDeposit.status}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Date:</span>
              <span className="text-white font-medium">{pendingDeposit.date}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="text-white font-medium">{pendingDeposit.transactionId}</span>
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
  
  return (
    <DashboardLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Deposit Funds</h1>
          
          <Button 
            variant="outline" 
            onClick={handleViewTransactions}
          >
            <FaHistory className="mr-2" /> View Deposit History
          </Button>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {alert && (
              <Alert 
                type={alert.type} 
                message={alert.message}
                onDismiss={() => setAlert(null)}
              />
            )}
            
            {/* Deposit Methods */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white mb-4">Select Deposit Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {depositMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`bg-gray-800 p-5 rounded-lg border-2 cursor-pointer transition-all
                      ${activeMethod?.id === method.id 
                        ? 'border-primary-500 shadow-lg' 
                        : 'border-gray-700 hover:border-gray-600'
                      }`}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                        {getMethodIcon(method.id)}
                      </div>
                      <h3 className="text-white font-medium mb-1">{method.name}</h3>
                      <p className="text-xs text-gray-400">Min: ${method.minDeposit}</p>
                      <p className="text-xs text-gray-400 mt-1">{method.processingTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Active Method Details */}
            <AnimatePresence mode="wait">
              {activeMethod && (
                <motion.div 
                  key={activeMethod.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className="bg-gray-800 p-5 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      {getMethodIcon(activeMethod.id)}
                      <span className="ml-2">{activeMethod.name} Deposit Instructions</span>
                    </h3>
                    
                    {/* Crypto Method */}
                    {(activeMethod.id === 'bitcoin' || activeMethod.id === 'ethereum') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-300 mb-4">
                            Please send your {activeMethod.name} to the address below. After sending, enter the transaction ID below to complete your deposit.
                          </p>
                          
                          <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Address:</span>
                              <span className="text-sm text-white font-medium">{formatCryptoAddress(activeMethod.address)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Minimum Deposit:</span>
                              <span className="text-sm text-white font-medium">${activeMethod.minDeposit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-400">Processing Time:</span>
                              <span className="text-sm text-white font-medium">{activeMethod.processingTime}</span>
                            </div>
                          </div>
                          
                          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-sm text-blue-300 flex items-start">
                            <FaInfoCircle className="text-blue-400 mr-2 mt-1 flex-shrink-0" />
                            <p>
                              Your deposit will be credited after {activeMethod.confirmations} network confirmations. 
                              Do not send any other cryptocurrency to this address.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <QRCode 
                            value={activeMethod.address}
                            label={`${activeMethod.name} Deposit Address`}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Bank Transfer Method */}
                    {activeMethod.id === 'bank' && (
                      <div>
                        <p className="text-gray-300 mb-4">
                          Please use the following bank details to make your transfer. After sending, enter the reference number below to complete your deposit.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <div className="mb-2">
                              <span className="text-sm text-gray-400">Bank Name:</span>
                              <p className="text-sm text-white font-medium">{activeMethod.bankName}</p>
                            </div>
                            <div className="mb-2">
                              <span className="text-sm text-gray-400">Account Name:</span>
                              <p className="text-sm text-white font-medium">{activeMethod.accountName}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-400">Account Number:</span>
                              <p className="text-sm text-white font-medium">{activeMethod.accountNumber}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <div className="mb-2">
                              <span className="text-sm text-gray-400">SWIFT Code:</span>
                              <p className="text-sm text-white font-medium">{activeMethod.swiftCode}</p>
                            </div>
                            <div className="mb-2">
                              <span className="text-sm text-gray-400">Routing Number:</span>
                              <p className="text-sm text-white font-medium">{activeMethod.routingNumber}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-400">Reference Prefix:</span>
                              <p className="text-sm text-white font-medium">{activeMethod.reference}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 text-sm text-yellow-300 flex items-start">
                          <FaInfoCircle className="text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                          <p>
                            Important: Please include the reference number in your bank transfer description. 
                            This helps us identify your deposit. Processing may take {activeMethod.processingTime}.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Deposit Form */}
            {activeMethod && (
              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Deposit Amount ($)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount to deposit"
                  error={errors.amount}
                  required
                />
                
                {/* Transaction ID field for crypto methods */}
                {(activeMethod.id === 'bitcoin' || activeMethod.id === 'ethereum') && (
                  <FormInput
                    label={`${activeMethod.name} Transaction ID`}
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder="Enter the transaction hash/ID"
                    error={errors.transactionId}
                    required
                  />
                )}
                
                {/* Reference field for bank transfers */}
                {activeMethod.id === 'bank' && (
                  <FormInput
                    label="Reference Number"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="Enter the reference number used in your transfer"
                    error={errors.reference}
                    required
                  />
                )}
                
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <h4 className="text-white font-medium mb-3">Deposit Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white">{activeMethod.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">${formData.amount || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Processing Time:</span>
                      <span className="text-white">{activeMethod.processingTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    isLoading={depositStatus === 'loading'}
                    disabled={depositStatus === 'loading'}
                  >
                    <FaArrowRight className="mr-2" /> Submit Deposit
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Deposit confirmation modal */}
      <AnimatePresence>
        {showConfirmation && renderDepositConfirmation()}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Deposit;
