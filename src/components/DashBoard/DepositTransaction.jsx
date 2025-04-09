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
import TransactionList from '../common/TransactionList';
import Loader from '../common/Loader';
import { FaSearch, FaFileExport, FaPrint } from 'react-icons/fa';
import Button from '../common/Button';

const DepositTransaction = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectDepositHistory);
  const status = useSelector(selectDepositStatus);
  const error = useSelector(selectDepositError);
  const pagination = useSelector(selectDepositPagination);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchDepositHistory(pagination.currentPage));
  }, [dispatch, pagination.currentPage]);

  const handleLoadMore = () => {
    if (pagination && pagination.currentPage < pagination.pages) {
      dispatch(setCurrentPage(pagination.currentPage + 1));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchDepositHistory(1));
  };

  const filteredTransactions = Array.isArray(transactions.deposits) ? transactions.deposits.filter(transaction => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      (transaction._id && transaction._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.method && transaction.method.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.status && transaction.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.txHash && transaction.txHash.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
  }) : [];

  const isLoading = status === 'loading';
  const detailFields = ['fee', 'description', 'txHash', 'metadata'];

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Deposit History</h1>
        
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
          title="Deposit Transactions"
          emptyMessage="You haven't made any deposits yet. Start by making a deposit from the Deposit page."
          errorMessage="Error loading deposit history. Please try again later."
          loadingMessage="Loading your deposit history..."
          pagination={transactions.pagination}
          onLoadMore={handleLoadMore}
          detailFields={detailFields}
          onRefresh={handleRefresh}
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

export default DepositTransaction;