import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDepositHistory,
  selectDepositHistory,
  selectDepositStatus,
  selectDepositError,
  selectDepositPagination,
  setCurrentPage
} from '../../redux/slices/depositSlice';
import DashboardLayout from './DashboardLayout';
import TransactionStatusBadge from '../common/TransactionStatusBadge';
import ComponentLoader from '../common/ComponentLoader';
import Loader from '../common/Loader';
import InfoCard from '../common/InfoCard';
import { FaExclamationTriangle, FaSearch, FaFileExport, FaPrint, FaEye, FaTimes, FaCopy } from 'react-icons/fa';
import { format } from 'date-fns';

const DepositTransaction = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectDepositHistory);
  const status = useSelector(selectDepositStatus);
  const error = useSelector(selectDepositError);
  const pagination = useSelector(selectDepositPagination);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    dispatch(fetchDepositHistory(pagination.currentPage));
  }, [dispatch, pagination.currentPage]);

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeDetails = () => {
    setSelectedTransaction(null);
    setCopySuccess('');
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.methodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.transactionId && transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()));

    // Date filter
    let matchesDate = true;
    const txDate = new Date(transaction.createdAt);
    const now = new Date();
    
    if (dateFilter === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      matchesDate = txDate >= todayStart;
    } else if (dateFilter === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      matchesDate = txDate >= weekStart;
    } else if (dateFilter === 'month') {
      const monthStart = new Date(now);
      monthStart.setMonth(now.getMonth() - 1);
      matchesDate = txDate >= monthStart;
    }

    return matchesSearch && matchesDate;
  });

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Deposit History</h1>
        
        {status === 'loading' && transactions.length === 0 ? (
          <ComponentLoader text="Loading deposit history..." />
        ) : error ? (
          <InfoCard
            icon={<FaExclamationTriangle className="text-red-500" size={24} />}
            title="Error loading deposit history"
            message={error}
            type="error"
          />
        ) : transactions.length === 0 ? (
          <InfoCard
            icon={<FaExclamationTriangle className="text-yellow-500" size={24} />}
            title="No deposits found"
            message="You haven't made any deposits yet."
            type="warning"
          />
        ) : (
          <>
            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
              <div className="flex flex-col sm:flex-row gap-3 flex-grow">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className="bg-gray-800 text-gray-100 py-2 pl-10 pr-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
                <select
                  className="bg-gray-800 text-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button className="bg-gray-800 text-gray-300 p-2 rounded-lg hover:bg-gray-700">
                  <FaFileExport className="inline mr-1" /> Export
                </button>
                <button className="bg-gray-800 text-gray-300 p-2 rounded-lg hover:bg-gray-700">
                  <FaPrint className="inline mr-1" /> Print
                </button>
              </div>
            </div>
            
            {/* Transactions Table */}
            <div className="overflow-x-auto bg-gray-800 rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transaction.methodName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TransactionStatusBadge status={transaction.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button 
                          onClick={() => handleViewDetails(transaction)}
                          className="text-primary-500 hover:text-primary-400"
                        >
                          <FaEye className="inline" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalItems}</span> results
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                    disabled={pagination.currentPage === 1}
                    className={`px-4 py-2 border rounded-md ${
                      pagination.currentPage === 1
                        ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`px-4 py-2 border rounded-md ${
                        pagination.currentPage === page + 1
                          ? 'bg-primary-600 text-white border-primary-500'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-4 py-2 border rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-100">Deposit Details</h2>
                <button onClick={closeDetails} className="text-gray-400 hover:text-white">
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Transaction ID</span>
                  <span className="text-sm font-medium text-gray-200">{selectedTransaction.id}</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Status</span>
                  <TransactionStatusBadge status={selectedTransaction.status} />
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-sm font-medium text-gray-200">${selectedTransaction.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Fees</span>
                  <span className="text-sm font-medium text-gray-200">${selectedTransaction.fees.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Net Amount</span>
                  <span className="text-sm font-medium text-gray-200">${selectedTransaction.netAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Method</span>
                  <span className="text-sm font-medium text-gray-200">{selectedTransaction.methodName}</span>
                </div>
                
                {selectedTransaction.transactionId && (
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-gray-400">Transaction Hash</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-200 break-all mr-2">{selectedTransaction.transactionId}</span>
                      <button 
                        onClick={() => handleCopyToClipboard(selectedTransaction.transactionId)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FaCopy size={16} />
                      </button>
                      {copySuccess === 'Copied!' && <span className="text-xs text-green-500 ml-2">{copySuccess}</span>}
                    </div>
                  </div>
                )}
                
                {selectedTransaction.reference && (
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-gray-400">Reference</span>
                    <span className="text-sm font-medium text-gray-200">{selectedTransaction.reference}</span>
                  </div>
                )}
                
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Created Date</span>
                  <span className="text-sm font-medium text-gray-200">
                    {format(new Date(selectedTransaction.createdAt), 'MMM dd, yyyy h:mm a')}
                  </span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-400">Last Updated</span>
                  <span className="text-sm font-medium text-gray-200">
                    {format(new Date(selectedTransaction.updatedAt), 'MMM dd, yyyy h:mm a')}
                  </span>
                </div>
                
                {selectedTransaction.confirmations > 0 && (
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-gray-400">Confirmations</span>
                    <span className="text-sm font-medium text-gray-200">{selectedTransaction.confirmations}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {status === 'loading' && transactions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default DepositTransaction;