import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaSearch, FaTimes, FaEye } from 'react-icons/fa';
import Button from '../../common/Button';
import TransactionStatusBadge from '../../common/TransactionStatusBadge';
import TransactionDetailsModal from '../../common/TransactionDetailsModal';
import DashboardLayout from '../Layout/DashboardLayout';
import ComponentLoader from '../../common/ComponentLoader';
import Pagination from '../../common/Pagination';
import {
  fetchDepositHistory,
  selectDepositHistory,
  selectDepositStatus,
  selectDepositError,
  selectDepositPagination
} from '../../../redux/slices/depositSlice';

const DepositTransaction = () => {
  const dispatch = useDispatch();
  const depositsData = useSelector(selectDepositHistory);
  const transaction = depositsData.deposits; 
  const pagination = useSelector(selectDepositPagination);
  const status = useSelector(selectDepositStatus);
  const error = useSelector(selectDepositError);
  const isLoading = status === 'loading';

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      search: searchQuery || undefined,
      sortBy,
      sortOrder
    };
    dispatch(fetchDepositHistory(params));
  }, [dispatch, currentPage, filterStatus, searchQuery, sortBy, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleStatusChange = (statusValue) => {
    setFilterStatus(statusValue);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleViewDetails = (deposit) => {
    setSelectedDeposit(deposit);
    setShowDetailsModal(true);
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

  if (isLoading && (!transaction || transaction.length === 0)) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Deposit History</h1>
          <ComponentLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Deposit History</h1>
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg">
            <p>Error: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-6">Deposit History</h1>
        
        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <input
                type="text"
                placeholder="Search deposits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setSearchQuery('')}
                >
                  <FaTimes />
                </button>
              )}
            </form>
            
            <div className="flex gap-2">
              <div className="relative inline-block">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center"
                >
                  <span>Status: {filterStatus === 'all' ? 'All' : filterStatus}</span>
                  <FaChevronDown className="ml-2" />
                </Button>
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
                    >
                      <div className="py-1">
                        {['all', 'pending', 'completed', 'failed'].map((statusValue) => (
                          <button
                            key={statusValue}
                            onClick={() => {
                              handleStatusChange(statusValue);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                              filterStatus === statusValue ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                          >
                            {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('reference')}
                  >
                    Reference
                    {sortBy === 'reference' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('method')}
                  >
                    Method
                    {sortBy === 'method' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    {sortBy === 'amount' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortBy === 'status' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {transaction && transaction.length > 0 ? (
                  transaction.map((deposit) => (
                    <tr key={deposit._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(deposit.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {deposit.reference || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {deposit.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(deposit.amount, deposit.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TransactionStatusBadge status={deposit.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          className="text-primary-400 hover:text-primary-300 font-medium flex items-center justify-end w-full"
                          onClick={() => handleViewDetails(deposit)}
                        >
                          <FaEye className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                      No deposit records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        Mobile View Cards
        <div className="md:hidden space-y-4 mb-6">
          {transaction && transaction.length > 0 ? (
            transaction.map((deposit) => (
              <motion.div
                key={deposit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 shadow-lg transition-all"
              >
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-400">Date:</span>
                  <span className="ml-2 text-sm text-gray-300">{formatDate(deposit.createdAt)}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-400">Reference:</span>
                  <span className="ml-2 text-sm text-gray-300">{deposit.reference || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-400">Method:</span>
                  <span className="ml-2 text-sm text-gray-300 capitalize">{deposit.method}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-400">Amount:</span>
                  <span className="ml-2 text-sm text-gray-300">{formatCurrency(deposit.amount, deposit.currency)}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-400">Status:</span>
                  <span className="ml-2 text-sm">
                    <TransactionStatusBadge status={deposit.status} />
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    className="text-primary-400 hover:text-primary-300 font-medium flex items-center"
                    onClick={() => handleViewDetails(deposit)}
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-gray-400">
              No deposit records found.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        
        {/* Transaction Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedDeposit && (
            <TransactionDetailsModal
              transaction={selectedDeposit}
              onClose={() => {
                setShowDetailsModal(false);
                setSelectedDeposit(null);
              }}
              showQR={selectedDeposit.method === 'crypto'}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default DepositTransaction;