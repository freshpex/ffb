import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUsers, 
  FaExchangeAlt, 
  FaDollarSign, 
  FaChartLine, 
  FaTicketAlt, 
  FaIdCard,
  FaSyncAlt
} from 'react-icons/fa';
import { 
  fetchAnalyticsOverview,
  selectAnalyticsOverview,
  selectAnalyticsStatus,
  selectAnalyticsError,
  selectAnalyticsLastFetched
} from '../../../redux/slices/adminAnalyticsSlice';

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const overview = useSelector(selectAnalyticsOverview);
  const status = useSelector(state => selectAnalyticsStatus(state, 'overview'));
  const error = useSelector(state => selectAnalyticsError(state, 'overview'));
  const lastFetched = useSelector(state => selectAnalyticsLastFetched(state, 'overview'));
  
  useEffect(() => {
    if (!overview || !lastFetched) {
      dispatch(fetchAnalyticsOverview());
    }
  }, [dispatch, overview, lastFetched]);
  
  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchAnalyticsOverview());
  };
  
  // Format percentage change
  const formatPercentage = (value) => {
    const isPositive = value >= 0;
    return (
      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {isPositive ? '+' : ''}{value.toFixed(1)}%
      </span>
    );
  };
  
  // Date from lastFetched
  const getRefreshInfo = () => {
    if (!lastFetched) return 'Not yet fetched';
    
    const fetchDate = new Date(lastFetched);
    const now = new Date();
    const diffMs = now - fetchDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Updated just now';
    if (diffMins === 1) return 'Updated 1 minute ago';
    return `Updated ${diffMins} minutes ago`;
  };
  
  if (status === 'loading' && !overview) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-between">
          <span>Dashboard Overview</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4 animate-pulse">
              <div className="h-6 w-24 bg-gray-600 rounded mb-3"></div>
              <div className="h-10 w-36 bg-gray-600 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-400">Error loading analytics: {error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm flex items-center"
          >
            <FaSyncAlt className="mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!overview) return null;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-between">
        <span>Dashboard Overview</span>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-3">{getRefreshInfo()}</span>
          <button 
            onClick={handleRefresh} 
            className="text-blue-400 hover:text-blue-300"
            disabled={status === 'loading'}
            title="Refresh data"
          >
            <FaSyncAlt className={status === 'loading' ? 'animate-spin' : ''} />
          </button>
        </div>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Stats */}
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Users</h3>
              <p className="text-white text-2xl font-semibold">{overview.users.total.toLocaleString()}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-400 mr-1">This month:</span>
                <span className="text-white font-medium">+{overview.users.thisMonth}</span>
                {' '}
                {formatPercentage(overview.users.growthRate)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-700/30">
              <FaUsers className="text-blue-400 text-lg" />
            </div>
          </div>
        </div>
        
        {/* Transaction Stats */}
        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Transactions</h3>
              <p className="text-white text-2xl font-semibold">{overview.transactions.total.toLocaleString()}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-400 mr-1">Today:</span>
                <span className="text-white font-medium">{overview.transactions.today}</span>
                {' | '}
                <span className="text-gray-400 mr-1">This week:</span>
                <span className="text-white font-medium">{overview.transactions.thisWeek}</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-700/30">
              <FaExchangeAlt className="text-purple-400 text-lg" />
            </div>
          </div>
        </div>
        
        {/* Financial Stats */}
        <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Net Balance</h3>
              <p className="text-white text-2xl font-semibold">{formatCurrency(overview.financial.netBalance)}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-400 mr-1">Deposits:</span>
                <span className="text-white font-medium">{formatCurrency(overview.financial.totalDeposits)}</span>
                {' | '}
                <span className="text-gray-400 mr-1">Withdrawals:</span>
                <span className="text-white font-medium">{formatCurrency(overview.financial.totalWithdrawals)}</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-700/30">
              <FaDollarSign className="text-green-400 text-lg" />
            </div>
          </div>
        </div>
        
        {/* Investment Stats */}
        <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-800/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Investments</h3>
              <p className="text-white text-2xl font-semibold">{formatCurrency(overview.investments.total)}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-400 mr-1">Active:</span>
                <span className="text-white font-medium">{formatCurrency(overview.investments.active)}</span>
                {' | '}
                <span className="text-gray-400 mr-1">Rate:</span>
                <span className="text-white font-medium">
                  {overview.investments.total > 0
                    ? Math.round((overview.investments.active / overview.investments.total) * 100)
                    : 0}%
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-700/30">
              <FaChartLine className="text-amber-400 text-lg" />
            </div>
          </div>
        </div>
        
        {/* Pending KYC */}
        <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-800/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Pending KYC Requests</h3>
              <p className="text-white text-2xl font-semibold">{overview.pending.kycRequests}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-400">
                  {overview.pending.kycRequests === 0 
                    ? 'No pending requests' 
                    : overview.pending.kycRequests === 1 
                      ? 'Requires immediate attention' 
                      : 'Require immediate attention'}
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-700/30">
              <FaIdCard className="text-indigo-400 text-lg" />
            </div>
          </div>
        </div>
        
        {/* Pending Support Tickets */}
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-800/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Support Tickets</h3>
              <p className="text-white text-2xl font-semibold">{overview.pending.supportTickets}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-400">
                  {overview.pending.supportTickets === 0 
                    ? 'No open tickets' 
                    : overview.pending.supportTickets === 1 
                      ? 'Open ticket' 
                      : 'Open tickets'}
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-700/30">
              <FaTicketAlt className="text-red-400 text-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
