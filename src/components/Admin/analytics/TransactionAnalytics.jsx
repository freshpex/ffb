import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaChevronDown, 
  FaExchangeAlt,
  FaSyncAlt, 
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import { 
  fetchTransactionAnalytics,
  selectTransactionAnalytics,
  selectAnalyticsStatus,
  selectAnalyticsError
} from '../../../redux/slices/adminAnalyticsSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import StatusBadge from '../common/StatusBadge';

const TransactionAnalytics = () => {
  const dispatch = useDispatch();
  const transactionData = useSelector(selectTransactionAnalytics);
  const status = useSelector(state => selectAnalyticsStatus(state, 'transactions'));
  const error = useSelector(state => selectAnalyticsError(state, 'transactions'));
  
  const [period, setPeriod] = useState('day');
  const [limit, setLimit] = useState(30);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
  useEffect(() => {
    dispatch(fetchTransactionAnalytics({ period, limit }));
  }, [dispatch, period, limit]);
  
  const handleRefresh = () => {
    dispatch(fetchTransactionAnalytics({ period, limit }));
  };
  
  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format period type label
  const formatPeriodLabel = (period) => {
    switch (period) {
      case 'hour':
        return '24 Hours';
      case 'day':
        return 'Daily';
      case 'week':
        return 'Weekly';
      case 'month':
        return 'Monthly';
      default:
        return 'Daily';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-gray-300 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-400">{entry.name}: </span>
              <span className="text-white font-medium ml-1">
                {entry.dataKey.toLowerCase().includes('volume')
                  ? formatCurrency(entry.value)
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // StatusBadge colors based on status
  const statusColors = {
    completed: 'green', 
    success: 'green',
    pending: 'yellow',
    processing: 'yellow',
    failed: 'red',
    rejected: 'red',
    cancelled: 'red'
  };
  
  // STATUS CHART COLORS
  const STATUS_COLORS = {
    completed: '#10B981', // emerald-500
    pending: '#F59E0B',   // amber-500
    failed: '#EF4444',    // red-500
    cancelled: '#6B7280', // gray-500
    rejected: '#EC4899',  // pink-500
    processing: '#8B5CF6'  // violet-500
  };
  
  // TYPE CHART COLORS
  const TYPE_COLORS = {
    deposit: '#3B82F6',   // blue-500
    withdrawal: '#F97316', // orange-500
    investment: '#8B5CF6', // violet-500
    transfer: '#14B8A6'    // teal-500
  };
  
  // Prepare distribution data for pie charts
  const prepareStatusDistribution = () => {
    if (!transactionData || !transactionData.distribution || !transactionData.distribution.byStatus) {
      return [];
    }
    
    return transactionData.distribution.byStatus.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count,
      volume: item.volume
    }));
  };
  
  const prepareTypeDistribution = () => {
    if (!transactionData || !transactionData.distribution || !transactionData.distribution.byType) {
      return [];
    }
    
    return transactionData.distribution.byType.map(item => ({
      name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      value: item.count,
      volume: item.volume
    }));
  };
  
  if (status === 'loading' && !transactionData) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
        <div className="h-64 bg-gray-700 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
          <p className="text-red-400">Error loading transaction analytics: {error}</p>
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
  
  if (!transactionData) return null;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FaExchangeAlt className="mr-2 text-purple-400" />
          Transaction Analytics
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded flex items-center text-sm"
            >
              {formatPeriodLabel(period)}
              <FaChevronDown className="ml-2 text-gray-400" size={12} />
            </button>
            
            {showPeriodDropdown && (
              <div className="absolute right-0 mt-1 bg-gray-700 rounded shadow-xl border border-gray-600 z-10">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => {
                        setPeriod('hour');
                        setLimit(24);
                        setShowPeriodDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      24 Hours
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setPeriod('day');
                        setLimit(30);
                        setShowPeriodDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Daily (30 days)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setPeriod('week');
                        setLimit(12);
                        setShowPeriodDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Weekly (12 weeks)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setPeriod('month');
                        setLimit(12);
                        setShowPeriodDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Monthly (12 months)
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 bg-gray-700 text-blue-400 rounded hover:bg-gray-600"
            disabled={status === 'loading'}
            title="Refresh data"
          >
            <FaSyncAlt className={status === 'loading' ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {/* Transaction Volume & Count Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Transaction Volume & Count</h3>
        <div className="h-72 bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={transactionData.timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="period" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
                  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                  return `$${value}`;
                }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 10, 
                  color: '#ffffff'
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="depositVolume" 
                stackId="volume"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                name="Deposit Volume"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="withdrawalVolume" 
                stackId="volume"
                stroke="#F97316" 
                fill="#F97316" 
                fillOpacity={0.6}
                name="Withdrawal Volume"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="deposit" 
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.3}
                name="Deposit Count"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="withdrawal" 
                stroke="#EF4444" 
                fill="#EF4444"
                fillOpacity={0.3}
                name="Withdrawal Count"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Status Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction by Status */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <FaCheckCircle className="mr-2 text-green-400" />
            Transactions by Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareStatusDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {prepareStatusDistribution().map((entry) => (
                      <Cell 
                        key={entry.name} 
                        fill={STATUS_COLORS[entry.name.toLowerCase()] || '#A3A3A3'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `Count: ${value}`, 
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Status List */}
            <div className="flex flex-col justify-center">
              <div className="overflow-y-auto max-h-64">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                        Status
                      </th>
                      <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                        Count
                      </th>
                      <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                        Volume
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {prepareStatusDistribution().map((status) => (
                      <tr key={status.name}>
                        <td className="py-2 text-sm whitespace-nowrap text-gray-300 flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: STATUS_COLORS[status.name.toLowerCase()] || '#A3A3A3' }}
                          ></div>
                          {status.name}
                        </td>
                        <td className="py-2 text-sm text-right whitespace-nowrap text-gray-300 font-medium">
                          {status.value.toLocaleString()}
                        </td>
                        <td className="py-2 text-sm text-right whitespace-nowrap text-gray-300 font-medium">
                          {formatCurrency(status.volume)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction by Type */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <FaFileAlt className="mr-2 text-blue-400" />
            Transactions by Type
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareTypeDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {prepareTypeDistribution().map((entry) => (
                      <Cell 
                        key={entry.name} 
                        fill={TYPE_COLORS[entry.name.toLowerCase()] || '#A3A3A3'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `Count: ${value}`, 
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Type List */}
            <div className="flex flex-col justify-center">
              <div className="overflow-y-auto max-h-64">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                        Type
                      </th>
                      <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                        Count
                      </th>
                      <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                        Volume
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {prepareTypeDistribution().map((type) => (
                      <tr key={type.name}>
                        <td className="py-2 text-sm whitespace-nowrap text-gray-300 flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: TYPE_COLORS[type.name.toLowerCase()] || '#A3A3A3' }}
                          ></div>
                          {type.name}
                        </td>
                        <td className="py-2 text-sm text-right whitespace-nowrap text-gray-300 font-medium">
                          {type.value.toLocaleString()}
                        </td>
                        <td className="py-2 text-sm text-right whitespace-nowrap text-gray-300 font-medium">
                          {formatCurrency(type.volume)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Highest Value Transactions */}
      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Highest Value Transactions</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/70">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/50 divide-y divide-gray-700">
              {transactionData.highestTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-700/30">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {tx.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                    {tx.user ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{tx.user.name}</span>
                        <span className="text-xs text-gray-400">{tx.user.email}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unknown user</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`capitalize ${
                      tx.type === 'deposit' ? 'text-green-400' : 
                      tx.type === 'withdrawal' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <StatusBadge status={tx.status} type="dark" />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(tx.date)}
                  </td>
                </tr>
              ))}
              
              {transactionData.highestTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
