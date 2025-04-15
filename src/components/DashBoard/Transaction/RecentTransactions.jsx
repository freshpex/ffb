import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt,
  FaChartLine
} from 'react-icons/fa';
import { format } from 'date-fns';
import { 
  fetchRecentTransactions, 
  selectRecentTransactions,
  selectTransactionsLoading,
  selectDashboardStatus
} from '../../../redux/slices/dashboardSlice';
import TransactionStatusBadge from '../../common/TransactionStatusBadge';
import CardLoader from '../../common/CardLoader';

const RecentTransactions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactions = useSelector(selectRecentTransactions);
  const status = useSelector(state => selectDashboardStatus(state, 'recentTransactions'));
  
  useEffect(() => {
    // Fetch transactions if not already loaded
    if (status !== 'succeeded') {
      dispatch(fetchRecentTransactions({ limit: 5 }));
    }
  }, [dispatch, status]);

  // Helper to get icon for transaction type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaArrowDown className="text-green-500" size={16} />;
      case 'withdrawal':
        return <FaArrowUp className="text-red-500" size={16} />;
      case 'trade':
        return <FaExchangeAlt className="text-blue-500" size={16} />;
      case 'investment':
        return <FaChartLine className="text-purple-500" size={16} />;
      default:
        return <FaExchangeAlt className="text-gray-500" size={16} />;
    }
  };

  // If the component is loading, show a skeleton loader
  if (status === 'loading') {
    return <CardLoader title="Recent Transactions" height="h-72" />;
  }

  // Process transactions to handle different API formats
  const processedTransactions = Array.isArray(transactions) ? 
    transactions : (transactions?.data || []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Recent Transactions</h2>
        <button 
          onClick={() => navigate('/account/transactions')}
          className="text-primary-500 text-sm flex items-center hover:text-primary-400"
        >
          View All <FaArrowRight className="ml-1" size={12} />
        </button>
      </div>
      
      {processedTransactions && processedTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
                <th className="pb-2">TYPE</th>
                <th className="pb-2">AMOUNT</th>
                <th className="pb-2 hidden sm:table-cell">DATE</th>
                <th className="pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {processedTransactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id} className="text-sm">
                  <td className="py-3 flex items-center">
                    <div className="p-2 rounded-full bg-gray-700 mr-3">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium capitalize">{transaction.type}</p>
                      <p className="text-gray-400 text-xs">{transaction.description || transaction.method || ''}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={transaction.type === 'deposit' ? 'text-green-500' : 
                      transaction.type === 'withdrawal' ? 'text-red-500' : 'text-gray-200'}>
                      {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                      ${parseFloat(transaction.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                  </td>
                  <td className="py-3 hidden sm:table-cell text-gray-400">
                    {transaction.createdAt ? format(new Date(transaction.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="py-3">
                    <TransactionStatusBadge status={transaction.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-700/30 p-4 rounded-lg text-center">
          <p className="text-gray-400">No recent transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
