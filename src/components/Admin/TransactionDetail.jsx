import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaExchangeAlt, 
  FaArrowDown, 
  FaArrowUp, 
  FaUser, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaMoneyBillWave,
  FaUniversity,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaExclamationCircle,
  FaInfoCircle,
  FaCommentAlt,
  FaHistory
} from 'react-icons/fa';
import { 
  fetchTransactionById, 
  approveTransaction, 
  rejectTransaction,
  selectSelectedTransaction, 
  selectTransactionsStatus, 
  selectTransactionActionStatus 
} from '../../redux/slices/adminTransactionsSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';
import StatusBadge from './common/StatusBadge';

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();
  
  const transaction = useSelector(selectSelectedTransaction);
  const status = useSelector(selectTransactionsStatus);
  const actionStatus = useSelector(selectTransactionActionStatus);
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Check if there is an action parameter in the URL (approve or reject)
  const actionParam = searchParams.get('action');
  
  useEffect(() => {
    document.title = "Transaction Details | Admin Dashboard";
    if (transactionId && transactionId !== "undefined") {
      dispatch(fetchTransactionById(transactionId));
    } else {
      console.error("Transaction ID is undefined");
    }
    
    // If action parameter is present, show the corresponding modal
    if (actionParam === 'approve') {
      setShowApproveModal(true);
    } else if (actionParam === 'reject') {
      setShowRejectModal(true);
    }
  }, [dispatch, transactionId, actionParam]);
  
  const handleApproveTransaction = async () => {
    try {
      await dispatch(approveTransaction(transactionId)).unwrap();
      setShowApproveModal(false);
    } catch (error) {
      console.error("Failed to approve transaction:", error);
    }
  };
  
  const handleRejectTransaction = async () => {
    try {
      if (!rejectionReason.trim()) {
        alert('Please provide a reason for rejection');
        return;
      }
      
      await dispatch(rejectTransaction({ 
        transactionId, 
        reason: rejectionReason 
      })).unwrap();
      
      setShowRejectModal(false);
    } catch (error) {
      console.error("Failed to reject transaction:", error);
    }
  };
  
  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString();
  };
  
  // Get transaction icon
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaArrowDown className="h-6 w-6 text-green-500" />;
      case 'withdrawal':
        return <FaArrowUp className="h-6 w-6 text-red-500" />;
      default:
        return <FaExchangeAlt className="h-6 w-6 text-blue-500" />;
    }
  };
  
  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <FaCreditCard className="h-5 w-5" />;
      case 'bank_transfer':
        return <FaUniversity className="h-5 w-5" />;
      case 'paypal':
        return <FaWallet className="h-5 w-5" />;
      case 'crypto':
        return <FaMoneyBillWave className="h-5 w-5" />;
      default:
        return <FaMoneyBillWave className="h-5 w-5" />;
    }
  };
  
  if (status === 'loading') {
    return <ComponentLoader height="500px" message="Loading transaction details..." />;
  }
  
  if (!transaction) {
    return (
      <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <FaExclamationCircle className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-yellow-500' : 'text-yellow-400'}`} />
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transaction not found</h3>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>The transaction you are looking for does not exist or was removed.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/admin/transactions')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back to Transactions
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Transaction Details
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              View and manage transaction information
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/admin/transactions')}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaArrowLeft className="mr-2" /> Back to Transactions
            </button>
          </div>
        </div>
        
        {/* Transaction Header Card */}
        <div className={`mb-6 rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        }`}>
          <div className="px-6 py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <div className={`p-4 mr-4 rounded-full ${
                  transaction.type === 'deposit' 
                    ? darkMode ? 'bg-green-900/20' : 'bg-green-100' 
                    : transaction.type === 'withdrawal' 
                      ? darkMode ? 'bg-red-900/20' : 'bg-red-100'
                      : darkMode ? 'bg-blue-900/20' : 'bg-blue-100'
                }`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ID: {transaction.id}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className={`text-2xl font-bold ${
                  transaction.type === 'deposit' 
                    ? 'text-green-500' 
                    : transaction.type === 'withdrawal' 
                      ? 'text-red-500'
                      : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </div>
                <div className="mt-1">
                  <StatusBadge status={transaction.status} size="large" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Details */}
          <div className={`lg:col-span-2 rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Transaction Details
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction Type</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} capitalize`}>{transaction.type}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                    <div className="mt-1">
                      <StatusBadge status={transaction.status} />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment Method</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="ml-2 capitalize">
                        {transaction.paymentMethod?.replace('_', ' ') || 'N/A'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      <FaCalendarAlt className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDate(transaction.createdAt)} at {formatTime(transaction.createdAt)}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fee</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(transaction.fee || 0, transaction.currency)}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
                      {formatCurrency(transaction.amount + (transaction.fee || 0), transaction.currency)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Payment Details */}
              {(transaction.details && Object.keys(transaction.details).length > 0) && (
                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Payment Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {transaction.details.bankName && (
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bank Name</p>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.details.bankName}</p>
                      </div>
                    )}
                    
                    {transaction.details.accountNumber && (
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account Number</p>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.details.accountNumber}</p>
                      </div>
                    )}
                    
                    {transaction.details.cardLast4 && (
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Card Number</p>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>**** **** **** {transaction.details.cardLast4}</p>
                      </div>
                    )}
                    
                    {transaction.details.cryptoAddress && (
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Crypto Address</p>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{transaction.details.cryptoAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Status History */}
              {transaction.statusHistory && transaction.statusHistory.length > 0 && (
                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaHistory className="inline mr-2" /> Status History
                  </h4>
                  
                  <div className="space-y-3">
                    {transaction.statusHistory.map((item, index) => (
                      <div key={index} className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Status changed from <StatusBadge status={item.from} size="small" /> to <StatusBadge status={item.to} size="small" />
                            </p>
                            {item.note && (
                              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <FaCommentAlt className="inline mr-1" /> {item.note}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-right">
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {formatDate(item.updatedAt)}
                            </p>
                            <p className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                              {item.updatedBy ? item.updatedBy.name : 'System'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* User Information */}
            <div className={`rounded-lg mb-6 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
            }`}>
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  User Information
                </h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`h-12 w-12 rounded-full mr-4 flex items-center justify-center ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <FaUser className={`h-6 w-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.user.fullName}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {transaction.user.email}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to={`/admin/users/${transaction.user._id}`}
                    className="w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    View User Profile
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Transaction Actions */}
            <div className={`rounded-lg ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
            }`}>
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Actions
                </h3>
              </div>
              
              <div className="p-6">
                {transaction.status === 'pending' ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowApproveModal(true)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      <FaCheckCircle className="mr-2" /> Approve Transaction
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                    >
                      <FaTimesCircle className="mr-2" /> Reject Transaction
                    </button>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg ${
                    transaction.status === 'completed'
                      ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-800'
                      : transaction.status === 'rejected'
                        ? darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-800'
                  }`}>
                    <p className="flex items-center">
                      <FaInfoCircle className="mr-2" />
                      {transaction.status === 'completed'
                        ? 'This transaction has been approved and processed.'
                        : transaction.status === 'rejected'
                          ? 'This transaction has been rejected.'
                          : `Transaction is in ${transaction.status} state.`
                      }
                    </p>
                    
                    {transaction.rejectionReason && (
                      <p className="mt-2 text-sm">
                        <strong>Reason:</strong> {transaction.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Approve Transaction
                </h3>
                
                <div className={`mb-4 p-4 rounded-lg ${
                  darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  <p className="text-sm flex items-start">
                    <FaInfoCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      You are about to approve a {transaction.type} transaction for {formatCurrency(transaction.amount, transaction.currency)}. This action cannot be undone.
                    </span>
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>User:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.user.firstName} {transaction.user.lastName}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={handleApproveTransaction}
                  disabled={actionStatus === 'loading'}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === 'loading' 
                      ? 'bg-green-500 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === 'loading' ? 'Processing...' : 'Confirm Approval'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  disabled={actionStatus === 'loading'}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode 
                      ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Reject Transaction
                </h3>
                
                <div className={`mb-4 p-4 rounded-lg ${
                  darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <p className="text-sm flex items-start">
                    <FaInfoCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      You are about to reject a {transaction.type} transaction for {formatCurrency(transaction.amount, transaction.currency)}. This action cannot be undone.
                    </span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-red-500 focus:border-red-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500'
                    } shadow-sm`}
                    rows="3"
                    placeholder="Please provide a reason for rejecting this transaction..."
                    required
                  ></textarea>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    This reason will be visible to the user and support staff.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>User:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.user.firstName} {transaction.user.lastName}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={handleRejectTransaction}
                  disabled={actionStatus === 'loading'}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === 'loading' 
                      ? 'bg-red-500 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === 'loading' ? 'Processing...' : 'Confirm Rejection'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  disabled={actionStatus === 'loading'}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode 
                      ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default TransactionDetail;
