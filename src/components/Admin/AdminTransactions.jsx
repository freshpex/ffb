import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaCalendarAlt, 
  FaArrowUp, 
  FaArrowDown,
  FaExchangeAlt,
  FaArrowRight
} from 'react-icons/fa';
import { fetchTransactions, selectTransactions, selectTransactionsPagination, selectTransactionsStatus } from '../../redux/slices/adminTransactionsSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';
import Pagination from './common/Pagination';
import StatusBadge from './common/StatusBadge';
import SearchFilter from './common/SearchFilter';

const AdminTransactions = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();
  
  const transactions = useSelector(selectTransactions);
  const pagination = useSelector(selectTransactionsPagination);
  const status = useSelector(selectTransactionsStatus);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const isLoading = status === 'loading';
  
  useEffect(() => {
    document.title = "Transactions | Admin Dashboard";
    loadTransactions();
  }, [page, limit]);
  
  const loadTransactions = () => {
    dispatch(fetchTransactions({
      page,
      limit
    }));
  };
  
  const handleSearch = ({ searchTerm, filters }) => {
    setPage(1);
    
    dispatch(fetchTransactions({
      page: 1,
      limit,
      search: searchTerm,
      type: filters.type,
      status: filters.status,
      dateRange: dateRange.start && dateRange.end ? dateRange : null
    }));
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when changing limit
  };
  
  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };
  
  // Define filter options
  const typeFilterOptions = [
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'investment', label: 'Investment' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'fee', label: 'Fee' }
  ];
  
  const statusFilterOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'rejected', label: 'Rejected' }
  ];
  
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
  
  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaArrowDown className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <FaArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return <FaExchangeAlt className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Get transaction background color based on type
  const getTransactionBgColor = (type) => {
    switch (type) {
      case 'deposit':
        return darkMode ? 'bg-green-900/20' : 'bg-green-100';
      case 'withdrawal':
        return darkMode ? 'bg-red-900/20' : 'bg-red-100';
      default:
        return darkMode ? 'bg-blue-900/20' : 'bg-blue-100';
    }
  };
  
  // Get transaction amount color based on type
  const getTransactionAmountColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'text-green-500';
      case 'withdrawal':
        return 'text-red-500';
      default:
        return darkMode ? 'text-gray-300' : 'text-gray-900';
    }
  };
  
  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Transaction Management
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            View and manage all financial transactions
          </p>
        </div>
        
        <SearchFilter
          onSearch={handleSearch}
          onFilter={(filters) => {
            console.log('Filters changed:', filters);
          }}
          searchPlaceholder="Search by ID, user, or description..."
          filters={[
            {
              id: 'type',
              label: 'Type',
              options: typeFilterOptions,
              placeholder: 'All Types'
            },
            {
              id: 'status',
              label: 'Status',
              options: statusFilterOptions,
              placeholder: 'All Statuses'
            }
          ]}
          className="mb-6"
        />
        
        {/* Date Range Filter */}
        <div className={`mb-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <FaCalendarAlt className="inline mr-2" /> Date Range Filter
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                From
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className={`w-full rounded-md text-sm px-3 py-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                To
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className={`w-full rounded-md text-sm px-3 py-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                if (dateRange.start && dateRange.end) {
                  dispatch(fetchTransactions({
                    page: 1,
                    limit,
                    dateRange
                  }));
                  setPage(1);
                } else {
                  alert('Please select both start and end dates');
                }
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm"
            >
              Apply Date Filter
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <ComponentLoader height="400px" message="Loading transactions..." />
        ) : (
          <div>
            <div className={`rounded-lg overflow-hidden ${
              darkMode ? 'border border-gray-700' : 'border border-gray-200 shadow-md'
            }`}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Transactions List
                </h2>
                <div className="flex items-center space-x-2">
                  <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Show:
                  </label>
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className={`rounded-md text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <p className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No transactions found
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Try adjusting your search or filter to find what you're looking for.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                        <tr 
                          key={transaction._id}
                          className={darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full mr-3 ${getTransactionBgColor(transaction.type)}`}>
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{transaction.user.fullName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {transaction.user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${getTransactionAmountColor(transaction.type)}`}>
                              {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </div>
                            {transaction.fee > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Fee: {formatCurrency(transaction.fee, transaction.currency)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={transaction.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {formatDate(transaction.createdAt)}
                            </div>
                            {transaction.updatedAt && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Completed: {formatDate(transaction.updatedAt)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/transactions/${transaction._id || transaction.id}`}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                                title="View Transaction"
                              >
                                <FaEye size={14} />
                              </Link>
                              {transaction.status === 'pending' && (
                                <>
                                  <Link
                                    to={`/admin/transactions/${transaction._id || transaction.id}?action=approve`}
                                    className={`p-1.5 rounded-full ${
                                      darkMode 
                                        ? 'bg-gray-700 text-green-400 hover:bg-gray-600' 
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                                    title="Approve Transaction"
                                  >
                                    <FaCheck size={14} />
                                  </Link>
                                  <Link
                                    to={`/admin/transactions/${transaction._id || transaction.id}?action=reject`}
                                    className={`p-1.5 rounded-full ${
                                      darkMode 
                                        ? 'bg-gray-700 text-red-400 hover:bg-gray-600' 
                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                    }`}
                                    title="Reject Transaction"
                                  >
                                    <FaTimes size={14} />
                                  </Link>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={pagination.page || 1}
                  totalPages={pagination.totalPages || 0}
                  totalItems={pagination.totalTransactions || 10}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
            
            {/* Transaction Analysis */}
            <div className={`mt-6 p-4 rounded-lg ${
              darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Transaction Quick Analysis
                </h3>
                <Link
                  to="/admin/analytics/transactions"
                  className="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                >
                  Full Analytics <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Deposits</p>
                  <p className={`mt-1 text-xl font-semibold text-green-500`}>
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === 'deposit' && t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Withdrawals</p>
                  <p className={`mt-1 text-xl font-semibold text-red-500`}>
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending Transactions</p>
                  <p className={`mt-1 text-xl font-semibold text-yellow-500`}>
                    {transactions.filter(t => t.status === 'pending').length}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Fees Collected</p>
                  <p className={`mt-1 text-xl font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {formatCurrency(
                      transactions
                        .filter(t => t.status === 'completed')
                        .reduce((sum, t) => sum + (t.fee || 0), 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminTransactions;
