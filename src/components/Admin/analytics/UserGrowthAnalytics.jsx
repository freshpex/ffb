import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaChevronDown, 
  FaUsers, 
  FaSyncAlt, 
  FaGlobe,
  FaCheckCircle,
  FaIdCard,
  FaCreditCard
} from 'react-icons/fa';
import { 
  fetchUserGrowthAnalytics,
  selectUserGrowthAnalytics,
  selectAnalyticsStatus,
  selectAnalyticsError
} from '../../../redux/slices/adminAnalyticsSlice';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const UserGrowthAnalytics = () => {
  const dispatch = useDispatch();
  const userGrowthData = useSelector(selectUserGrowthAnalytics);
  const status = useSelector(state => selectAnalyticsStatus(state, 'userGrowth'));
  const error = useSelector(state => selectAnalyticsError(state, 'userGrowth'));
  
  const [period, setPeriod] = useState('month');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
  useEffect(() => {
    dispatch(fetchUserGrowthAnalytics({ period }));
  }, [dispatch, period]);
  
  const handleRefresh = () => {
    dispatch(fetchUserGrowthAnalytics({ period }));
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
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-gray-300 font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-400">{entry.name}: </span>
              <span className="text-white font-medium ml-1">
                {entry.value.toLocaleString()}
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
    cumulative: '#60A5FA', // blue-400
    new: '#34D399', // emerald-400
    verified: '#A78BFA', // violet-400
    unverified: '#F87171' // red-400
  };
  
  // COUNTRIES PIE CHART COLORS
  const COUNTRY_COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#6366F1', // indigo-500
    '#14B8A6', // teal-500
    '#F97316', // orange-500
    '#8B5CF6', // violet-500
  ];
  
  if (status === 'loading' && !userGrowthData) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
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
          <p className="text-red-400">Error loading user analytics: {error}</p>
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
  
  if (!userGrowthData) return null;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FaUsers className="mr-2 text-blue-400" />
          User Growth Analytics
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
      
      {/* User Growth Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-200 mb-4">User Growth Trend</h3>
        <div className="h-72 bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={userGrowthData.growthData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="period" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
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
                dataKey="cumulative" 
                stroke={colors.cumulative} 
                activeDot={{ r: 8 }} 
                name="Total Users"
              />
              <Line 
                type="monotone" 
                dataKey="new" 
                stroke={colors.new} 
                name="New Users"
              />
              <Line 
                type="monotone" 
                dataKey="verified" 
                stroke={colors.verified} 
                name="Verified Users"
              />
              <Line 
                type="monotone" 
                dataKey="unverified" 
                stroke={colors.unverified} 
                name="Unverified Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* User Metrics and Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Conversion Metrics */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">User Conversion</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Verification */}
            <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Email Verification Rate</p>
                  <p className="text-xl font-semibold text-white mt-1">
                    {userGrowthData.conversion.verificationRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 rounded-full bg-green-900/30">
                  <FaCheckCircle className="text-green-400" />
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${userGrowthData.conversion.verificationRate}%` }}
                ></div>
              </div>
            </div>
            
            {/* KYC Submission */}
            <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">KYC Submission Rate</p>
                  <p className="text-xl font-semibold text-white mt-1">
                    {userGrowthData.conversion.kycSubmissionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 rounded-full bg-indigo-900/30">
                  <FaIdCard className="text-indigo-400" />
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full" 
                  style={{ width: `${userGrowthData.conversion.kycSubmissionRate}%` }}
                ></div>
              </div>
            </div>
            
            {/* KYC Approval */}
            <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">KYC Approval Rate</p>
                  <p className="text-xl font-semibold text-white mt-1">
                    {userGrowthData.conversion.kycApprovalRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-900/30">
                  <FaCheckCircle className="text-blue-400" />
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${userGrowthData.conversion.kycApprovalRate}%` }}
                ></div>
              </div>
            </div>
            
            {/* Deposit Conversion */}
            <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Deposit Conversion</p>
                  <p className="text-xl font-semibold text-white mt-1">
                    {userGrowthData.conversion.depositConversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 rounded-full bg-amber-900/30">
                  <FaCreditCard className="text-amber-400" />
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${userGrowthData.conversion.depositConversionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Demographics */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <FaGlobe className="mr-2 text-blue-400" />
            Users by Country
          </h3>
          
          {userGrowthData.demographics.byCountry.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              {/* Country Pie Chart */}
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userGrowthData.demographics.byCountry}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="country"
                      label={({ country, percent }) => `${country} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {userGrowthData.demographics.byCountry.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} users`, 'Count']}
                      labelFormatter={(country) => `${country}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Country List */}
              <div className="flex flex-col justify-center">
                <div className="overflow-y-auto max-h-56">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                          Country
                        </th>
                        <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                          Users
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {userGrowthData.demographics.byCountry.slice(0, 8).map((country, index) => (
                        <tr key={country.country}>
                          <td className="py-2 text-sm whitespace-nowrap text-gray-300 flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COUNTRY_COLORS[index % COUNTRY_COLORS.length] }}
                            ></div>
                            {country.country}
                          </td>
                          <td className="py-2 text-sm text-right whitespace-nowrap text-gray-300 font-medium">
                            {country.count.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <p className="text-gray-400">No country data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGrowthAnalytics;
