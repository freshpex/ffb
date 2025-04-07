import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaChevronDown, 
  FaChartBar, 
  FaSyncAlt, 
  FaMoneyBillWave,
  FaRegCreditCard,
  FaExchangeAlt
} from 'react-icons/fa';
import { 
  fetchFinancialAnalytics,
  selectFinancialAnalytics,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const FinancialAnalytics = () => {
  const dispatch = useDispatch();
  const financialData = useSelector(selectFinancialAnalytics);
  const status = useSelector(state => selectAnalyticsStatus(state, 'financial'));
  const error = useSelector(state => selectAnalyticsError(state, 'financial'));
  
  const [period, setPeriod] = useState('month');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
  useEffect(() => {
    dispatch(fetchFinancialAnalytics({ period }));
  }, [dispatch, period]);
  
  const handleRefresh = () => {
    dispatch(fetchFinancialAnalytics({ period }));
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
  
  // Format date labels based on period type
  const formatPeriodLabel = (period) => {
    switch (period) {
      case 'day':
        return 'Daily';
      case 'week':
        return 'Weekly';
      case 'month':
        return 'Monthly';
      default:
        return 'Monthly';
    }
  };
  
  // Format periods for X-axis
  const formatXAxis = (value) => {
    if (!value) return '';
    
    // For month period
    if (period === 'month' && value.includes('-')) {
      const [year, month] = value.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleString('default', { month: 'short' });
    }
    
    // For week period (e.g. 2023-W32)
    if (period === 'week' && value.includes('-W')) {
      const [year, week] = value.split('-W');
      return `W${week}`;
    }
    
    // For day period
    if (period === 'day' && value.includes('-')) {
      const date = new Date(value);
      return date.toLocaleDateString('default', { day: 'numeric', month: 'short' });
    }
    
    return value;
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
                {entry.name.toLowerCase().includes('total') || entry.name.toLowerCase().includes('revenue')
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
  
  // Colors for charts
  const colors = {
    deposit: '#34D399', // emerald-400
    withdrawal: '#F87171', // red-400
    revenue: '#A78BFA', // violet-400
    count: '#60A5FA', // blue-400
  };
  
  // PAYMENT METHOD COLORS
  const METHOD_COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#6366F1', // indigo-500
    '#14B8A6', // teal-500
  ];
  
  // Transform financial time series data for chart
  const prepareTimeSeriesData = () => {
    if (!financialData || !financialData.timeSeriesData) return [];
    
    return financialData.timeSeriesData.map(item => ({
      period: item.period,
      'Deposit Total': item.deposit.total,
      'Withdrawal Total': item.withdrawal.total,
      'Deposit Count': item.deposit.count,
      'Withdrawal Count': item.withdrawal.count,
      'Revenue': item.revenue
    }));
  };
  
  // Transform deposit methods for pie chart
  const prepareDepositMethodsData = () => {
    if (!financialData || !financialData.metrics.depositMethods) return [];
    
    return financialData.metrics.depositMethods.map(method => ({
      name: method.method,
      value: method.total
    }));
  };
  
  // Transform withdrawal methods for pie chart
  const prepareWithdrawalMethodsData = () => {
    if (!financialData || !financialData.metrics.withdrawalMethods) return [];
    
    return financialData.metrics.withdrawalMethods.map(method => ({
      name: method.method,
      value: method.total
    }));
  };
  
  if (status === 'loading' && !financialData) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
        <div className="h-64 bg-gray-700 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-700 rounded"></div>
          <div className="h-40 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
          <p className="text-red-400">Error loading financial analytics: {error}</p>
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
  
  if (!financialData) return null;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FaChartBar className="mr-2 text-green-400" />
          Financial Analytics
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
                        setPeriod('day');
                        setShowPeriodDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Daily
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setPeriod('week');
                        setShowPeriodDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Weekly
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setPeriod('month');
                        setShowPeriodDropdown(false);
                      }}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Monthly
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
      
      {/* Transaction Volume Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Transaction Volume</h3>
        <div className="h-72 bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={prepareTimeSeriesData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="period" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={formatXAxis}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
                  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                  return `$${value}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 10, 
                  color: '#ffffff'
                }}
              />
              <Bar 
                dataKey="Deposit Total" 
                fill={colors.deposit}
                barSize={20}
              />
              <Bar 
                dataKey="Withdrawal Total" 
                fill={colors.withdrawal}
                barSize={20}
              />
              <Bar 
                dataKey="Revenue" 
                fill={colors.revenue}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Transaction Count Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Transaction Count</h3>
        <div className="h-72 bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={prepareTimeSeriesData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="period" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={formatXAxis}
              />
              <YAxis 
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
              <Line 
                type="monotone" 
                dataKey="Deposit Count" 
                stroke={colors.deposit} 
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="Withdrawal Count" 
                stroke={colors.withdrawal}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Success Rates and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Rates */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <FaExchangeAlt className="mr-2 text-amber-400" />
            Transaction Success Rates
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Deposit Success Rate */}
            <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/50">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-400 text-sm">Deposit Success Rate</p>
                  <p className="text-xl font-semibold text-white mt-1">
                    {financialData.metrics.depositSuccessRate.toFixed(1)}%
                  </p>
                </div>
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `conic-gradient(#10B981 ${financialData.metrics.depositSuccessRate * 3.6}deg, #1F2937 0deg)`
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium text-green-400">
                    {financialData.metrics.depositSuccessRate.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${financialData.metrics.depositSuccessRate}%` }}
                ></div>
              </div>
            </div>
            
            {/* Withdrawal Success Rate */}
            <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/50">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-400 text-sm">Withdrawal Success Rate</p>
                  <p className="text-xl font-semibold text-white mt-1">
                    {financialData.metrics.withdrawalSuccessRate.toFixed(1)}%
                  </p>
                </div>
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `conic-gradient(#F59E0B ${financialData.metrics.withdrawalSuccessRate * 3.6}deg, #1F2937 0deg)`
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium text-amber-400">
                    {financialData.metrics.withdrawalSuccessRate.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${financialData.metrics.withdrawalSuccessRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="grid grid-cols-1 gap-6">
          {/* Deposit Methods */}
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-400" />
              Deposit Methods
            </h3>
            
            {financialData.metrics.depositMethods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pie Chart */}
                <div className="h-40 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDepositMethodsData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {prepareDepositMethodsData().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={METHOD_COLORS[index % METHOD_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Method List */}
                <div className="overflow-y-auto max-h-40">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-1">
                          Method
                        </th>
                        <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-1">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {financialData.metrics.depositMethods.map((method, index) => (
                        <tr key={method.method}>
                          <td className="py-1 text-sm whitespace-nowrap text-gray-300 flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: METHOD_COLORS[index % METHOD_COLORS.length] }}
                            ></div>
                            {method.method}
                          </td>
                          <td className="py-1 text-sm text-right whitespace-nowrap text-gray-300 font-medium">
                            {formatCurrency(method.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-gray-400">No deposit methods data available</p>
              </div>
            )}
          </div>
          
          {/* Withdrawal Methods */}
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <FaRegCreditCard className="mr-2 text-red-400" />
              Withdrawal Methods
            </h3>
            
            {financialData.metrics.withdrawalMethods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pie Chart */}
                <div className="h-40 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareWithdrawalMethodsData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {prepareWithdrawalMethodsData().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={METHOD_COLORS[index % METHOD_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Method List */}
                <div className="overflow-y-auto max-h-40">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-1">
                          Method
                        </th>
                        <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-1">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {financialData.metrics.withdrawalMethods.map((method, index) => (
                        <tr key={method.method}>
                          <td className="py-1 text-sm whitespace-nowrap text-gray-300 flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: METHOD_COLORS[index % METHOD_COLORS.length] }}
                            ></div>
                            {method.method}
                          </td>
                          <td className="py-1 text-sm text-right whitespace-nowrap text-gray-300 font-medium">
                            {formatCurrency(method.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-gray-400">No withdrawal methods data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
