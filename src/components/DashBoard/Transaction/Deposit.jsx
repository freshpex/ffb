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
  FaQrcode,
  FaDollarSign,
  FaCopy
} from "react-icons/fa";
import DashboardLayout from "../Layout/DashboardLayout";
import FormInput from "../../common/FormInput";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import QRCode from "../../common/QRCode";
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
} from "../../../redux/slices/depositSlice";

const Deposit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const depositMethods = useSelector(selectDepositMethods);
  const activeMethod = useSelector(selectDepositMethods).find(
    method => method.id === useSelector(selectActiveMethod)
  );
  const formData = useSelector(selectDepositForm);
  const depositStatus = useSelector(selectDepositStatus);
  const depositError = useSelector(selectDepositError);
  const pendingDeposit = useSelector(selectPendingDeposit);
  
  // Local state
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  
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
    setSelectedCrypto(null);
  };
  
  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
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
  
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (activeMethod && parseFloat(formData.amount) < activeMethod.minAmount) {
      newErrors.amount = `Minimum deposit amount is $${activeMethod.minAmount}`;
    }
    
    // Transaction ID validation for crypto deposits
    if (activeMethod?.id === 'cryptocurrency' && !formData.transactionId) {
      newErrors.transactionId = "Transaction ID is required";
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
    
    if (activeMethod.id === 'cryptocurrency' && !selectedCrypto) {
      setAlert({
        type: "error",
        message: "Please select a cryptocurrency"
      });
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      const depositData = {
        method: activeMethod.id,
        amount: parseFloat(formData.amount),
        transactionId: formData.transactionId,
        note: formData.note
      };
      
      // Add crypto-specific details if applicable
      if (activeMethod.id === 'cryptocurrency' && selectedCrypto) {
        depositData.cryptoType = selectedCrypto.id;
        depositData.cryptoAddress = selectedCrypto.address;
        depositData.networkType = selectedCrypto.networkType;
      }
      
      await dispatch(submitDeposit(depositData));
      
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
      case 'cryptocurrency':
        return <FaBitcoin className="text-yellow-500" />;
      // case 'bank_transfer':
      //   return <FaUniversity className="text-gray-400" />;
      // case 'card':
      //   return <FaMoneyBillWave className="text-green-500" />;
      default:
        return <FaDollarSign className="text-green-500" />;
    }
  };
  
  const getCryptoIcon = (cryptoId) => {
    switch (cryptoId) {
      case 'bitcoin':
        return <FaBitcoin className="text-yellow-500" />;
      case 'ethereum':
        return <FaEthereum className="text-blue-400" />;
      case 'usdt':
        return <FaDollarSign className="text-green-500" />;
      default:
        return <FaBitcoin className="text-yellow-500" />;
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
            <p className="text-gray-400">Your deposit request has been successfully submitted. Admin will approve it soon.</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-medium">${pendingDeposit.amount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Method:</span>
              <span className="text-white font-medium flex items-center">
                {pendingDeposit.cryptoType ? 
                  getCryptoIcon(pendingDeposit.cryptoType) : 
                  getMethodIcon(pendingDeposit.method)}
                <span className="ml-2">
                  {pendingDeposit.cryptoType ? 
                    activeMethod?.cryptoOptions?.find(c => c.id === pendingDeposit.cryptoType)?.name || pendingDeposit.cryptoType : 
                    pendingDeposit.method}
                </span>
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Status:</span>
              <span className="text-yellow-400 font-medium">{pendingDeposit.status || "Pending"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Date:</span>
              <span className="text-white font-medium">{new Date(pendingDeposit.createdAt || Date.now()).toLocaleString()}</span>
            </div>
            {pendingDeposit.transactionId && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-white font-medium break-all text-xs">{pendingDeposit.transactionId}</span>
              </div>
            )}
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
        className="w-full p-4"
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
                className="mb-6"
              />
            )}
            
            {/* Deposit Methods */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white mb-4">Select Deposit Method</h2>
              <div className="grid grid-cols-1 gap-4">
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
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                        {getMethodIcon(method.id)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">{method.name}</h3>
                        <p className="text-xs text-gray-400">Min: ${method.minAmount} - Max: ${method.maxAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cryptocurrency Options */}
            <AnimatePresence>
              {activeMethod?.id === 'cryptocurrency' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <h2 className="text-lg font-medium text-white mb-4">Select Cryptocurrency</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeMethod.cryptoOptions.map((crypto) => (
                      <div 
                        key={crypto.id}
                        className={`bg-gray-800 p-5 rounded-lg border-2 cursor-pointer transition-all
                          ${selectedCrypto?.id === crypto.id 
                            ? 'border-primary-500 shadow-lg' 
                            : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => handleCryptoSelect(crypto)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                            {getCryptoIcon(crypto.id)}
                          </div>
                          <h3 className="text-white font-medium mb-1">{crypto.name}</h3>
                          <p className="text-xs text-gray-400">{crypto.networkType}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Selected Crypto Details */}
            <AnimatePresence>
              {selectedCrypto && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-gray-800 p-5 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      {getCryptoIcon(selectedCrypto.id)}
                      <span className="ml-2">{selectedCrypto.name} Deposit Instructions</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-300 mb-4">
                          Please send your {selectedCrypto.name} to the address below. After sending, enter the transaction ID to complete your deposit.
                        </p>
                        
                        <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
                          <div className="mb-2">
                            <span className="text-sm text-gray-400">Address:</span>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-white font-medium break-all mr-2">{selectedCrypto.address}</span>
                              <button 
                                onClick={() => handleCopyToClipboard(selectedCrypto.address)}
                                className="text-gray-400 hover:text-white"
                              >
                                <FaCopy size={16} />
                              </button>
                              {copySuccess === 'Copied!' && 
                                <span className="text-xs text-green-500 ml-2">{copySuccess}</span>}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Network Type:</span>
                            <span className="text-sm text-white font-medium">{selectedCrypto.networkType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Required Confirmations:</span>
                            <span className="text-sm text-white font-medium">{selectedCrypto.confirmations}</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-sm text-blue-300 flex items-start">
                          <FaInfoCircle className="text-blue-400 mr-2 mt-1 flex-shrink-0" />
                          <p>
                            Your deposit will be credited after {selectedCrypto.confirmations} network confirmations. 
                            Do not send any other cryptocurrency to this address.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center items-center">
                        <QRCode 
                          value={selectedCrypto.address}
                          size={180}
                          label={`${selectedCrypto.name} Address`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Deposit Form */}
            {activeMethod && (activeMethod.id !== 'cryptocurrency' || selectedCrypto) && (
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
                
                {activeMethod.id === 'cryptocurrency' && (
                  <FormInput
                    label="Transaction ID/Hash"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder="Enter the transaction ID from your wallet"
                    error={errors.transactionId}
                    required
                  />
                )}
                
                <FormInput
                  label="Note (Optional)"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add a note to your deposit"
                />
                
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <h4 className="text-white font-medium mb-3">Deposit Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white">
                        {activeMethod.id === 'cryptocurrency' ? selectedCrypto?.name : activeMethod.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">${formData.amount || '0.00'}</span>
                    </div>
                    {activeMethod.id === 'cryptocurrency' && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing:</span>
                        <span className="text-white">After {selectedCrypto?.confirmations || 'required'} confirmations</span>
                      </div>
                    )}
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
