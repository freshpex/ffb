import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWithdrawalHistory,
  selectWithdrawalHistory,
  selectWithdrawalStatus,
  selectWithdrawalError,
  selectWithdrawalPagination,
  setCurrentPage,
  cancelWithdrawal
} from '../../redux/slices/withdrawalSlice';
import DashboardLayout from './DashboardLayout';
import TransactionList from '../common/TransactionList';
import ComponentLoader from '../common/ComponentLoader';
import Loader from '../common/Loader';
import InfoCard from '../common/InfoCard';
import Button from "../common/Button";
import Alert from "../common/Alert";
import { 
  FaExclamationTriangle, 
  FaSearch, 
  FaFileExport, 
  FaPrint, 
  FaInfoCircle,
  FaBan 
} from 'react-icons/fa';
import { format } from 'date-fns';

const WithdrawTransaction = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectWithdrawalHistory);
  console.log("Withdarwal history", transactions);
  const status = useSelector(selectWithdrawalStatus);
  const error = useSelector(selectWithdrawalError);
  const pagination = useSelector(selectWithdrawalPagination);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [alert, setAlert] = useState(null);
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);

  useEffect(() => {
    dispatch(fetchWithdrawalHistory({ page: pagination.currentPage, limit: pagination.itemsPerPage }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage]);

  // Clear alerts after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleLoadMore = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      dispatch(setCurrentPage(pagination.currentPage + 1));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchWithdrawalHistory({ page: 1, limit: pagination.itemsPerPage }));
  };

  const handleViewDetails = (transaction) => {
    setExpandedTransactionId(expandedTransactionId === transaction._id ? null : transaction._id);
  };

  const handleCancelWithdrawal = async (withdrawalId) => {
    if (confirm('Are you sure you want to cancel this withdrawal?')) {
      try {
        await dispatch(cancelWithdrawal(withdrawalId)).unwrap();
        setAlert({
          type: 'success',
          message: 'Withdrawal cancelled successfully'
        });
        dispatch(fetchWithdrawalHistory({ page: pagination.currentPage, limit: pagination.itemsPerPage }));
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to cancel withdrawal'
        });
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      (transaction._id && transaction._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.method && transaction.method.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.status && transaction.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.walletAddress && transaction.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()));

    // Date filter
    let matchesDate = true;
    if (transaction.createdAt) {
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
    }

    return matchesSearch && matchesDate;
  });

  const isLoading = status === 'loading';
  const detailFields = ['fee', 'description', 'walletAddress', 'bankDetails', 'paypalEmail', 'cryptoType'];

  // Custom actions for withdrawal transactions
  const renderCustomActions = (transaction) => {
    if (transaction.status === 'pending') {
      return (
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => handleCancelWithdrawal(transaction._id)}
          className="mt-2"
        >
          <FaBan className="mr-1" /> Cancel Withdrawal
        </Button>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Withdrawal History</h1>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            onDismiss={() => setAlert(null)}
            className="mb-6"
          />
        )}
        
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
          <div className="flex flex-col sm:flex-row gap-3 flex-grow">
            <div className="relative flex-grow">
              <input
                type="text"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 pl-10 pr-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300 dark:border-gray-700"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
            <select
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300 dark:border-gray-700"
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
            <Button variant="secondary" size="sm">
              <FaFileExport className="mr-1" /> Export
            </Button>
            <Button variant="secondary" size="sm">
              <FaPrint className="mr-1" /> Print
            </Button>
          </div>
        </div>
        
        {/* Transaction List - Responsive View */}
        <TransactionList 
          transactions={filteredTransactions}
          isLoading={isLoading}
          error={error}
          title="Withdrawal Transactions"
          emptyMessage="You haven't made any withdrawals yet. Start by making a withdrawal from the Withdraw page."
          errorMessage="Error loading withdrawal history. Please try again later."
          loadingMessage="Loading your withdrawal history..."
          pagination={pagination}
          onLoadMore={handleLoadMore}
          detailFields={detailFields}
          onRefresh={handleRefresh}
          renderCustomActions={renderCustomActions}
        />
      </div>
      
      {/* Loading overlay */}
      {status === 'loading' && filteredTransactions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default WithdrawTransaction;