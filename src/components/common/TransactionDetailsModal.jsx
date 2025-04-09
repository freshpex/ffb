import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  FaTimes, 
  FaClipboard, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaQrcode,
  FaDownload
} from 'react-icons/fa';
import Button from './Button';

const TransactionDetailsModal = ({ transaction, onClose, showQR = false }) => {
  const [copySuccess, setCopySuccess] = useState(null);
  
  // Handle copy to clipboard function
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess('Copied to clipboard!');
    
    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };
  
  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <FaCheckCircle className="mr-2" />;
      case 'failed':
      case 'rejected':
        return <FaExclamationCircle className="mr-2" />;
      default:
        return null;
    }
  };
  
  const transactionType = transaction.type || (transaction.amount < 0 ? 'withdrawal' : 'deposit');
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-800 rounded-lg w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Transaction Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Transaction Status */}
          <div className="flex items-center mb-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {getStatusIcon(transaction.status)}
              <span className="capitalize">{transaction.status}</span>
            </div>
          </div>
          
          {/* Main Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Transaction ID</span>
              <div className="text-white font-medium flex items-center">
                {transaction.id || transaction._id}
                <button
                  onClick={() => handleCopy(transaction.id || transaction._id)}
                  className="ml-2 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <FaClipboard size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-medium">
                {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
              </span>
            </div>
            
            {transaction.fee > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Fee</span>
                <span className="text-white font-medium">
                  {formatCurrency(transaction.fee, transaction.currency)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Date</span>
              <span className="text-white font-medium">
                {formatDate(transaction.createdAt)}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Type</span>
              <span className="text-white font-medium capitalize">
                {transactionType}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Method</span>
              <span className="text-white font-medium capitalize">
                {transaction.method}
              </span>
            </div>
            
            {transaction.reference && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Reference</span>
                <div className="text-white font-medium flex items-center">
                  {transaction.reference}
                  <button
                    onClick={() => handleCopy(transaction.reference)}
                    className="ml-2 text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    <FaClipboard size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Display method-specific details */}
          {transaction.method === 'bank_transfer' && transaction.bankDetails && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Bank Details</h4>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                {transaction.bankDetails.accountName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Name</span>
                    <span className="text-white">{transaction.bankDetails.accountName}</span>
                  </div>
                )}
                {transaction.bankDetails.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Number</span>
                    <span className="text-white">{transaction.bankDetails.accountNumber}</span>
                  </div>
                )}
                {transaction.bankDetails.bankName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank Name</span>
                    <span className="text-white">{transaction.bankDetails.bankName}</span>
                  </div>
                )}
                {transaction.bankDetails.routingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Routing Number</span>
                    <span className="text-white">{transaction.bankDetails.routingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Crypto wallet */}
          {transaction.method === 'crypto' && transaction.walletAddress && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Crypto Details</h4>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Crypto Type</span>
                  <span className="text-white">{transaction.cryptoType || 'Bitcoin'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wallet Address</span>
                  <div className="text-white flex items-center">
                    <span className="truncate max-w-[150px]">{transaction.walletAddress}</span>
                    <button
                      onClick={() => handleCopy(transaction.walletAddress)}
                      className="ml-2 text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      <FaClipboard size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* QR Code for crypto transactions */}
          {showQR && transaction.method === 'crypto' && (
            <div className="mb-6 text-center">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Scan to Send Payment</h4>
              <div className="bg-white p-3 rounded-lg inline-block mx-auto">
                <FaQrcode size={150} className="text-gray-900" />
              </div>
              <p className="mt-2 text-sm text-gray-400">Scan this QR code to send payment</p>
            </div>
          )}
          
          {/* Notes or descriptions */}
          {transaction.note && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Note</h4>
              <p className="text-gray-400 text-sm">{transaction.note}</p>
            </div>
          )}
          
          {/* Copy message */}
          {copySuccess && (
            <div className="mt-3 text-center">
              <p className="text-green-400 text-sm">{copySuccess}</p>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            {transaction.status === 'completed' && (
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => handleCopy(transaction.id || transaction._id)}
              >
                <FaDownload className="mr-2" /> Download Receipt
              </Button>
            )}
            <Button 
              fullWidth 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

TransactionDetailsModal.propTypes = {
  transaction: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  showQR: PropTypes.bool
};

export default TransactionDetailsModal;