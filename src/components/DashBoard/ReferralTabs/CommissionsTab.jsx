import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  selectReferralCommissions,
  selectReferralStats
} from '../../../redux/slices/referralSlice';
import { 
  FaMoneyBillWave, 
  FaArrowUp, 
  FaArrowDown, 
  FaCircle, 
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaFileExport,
  FaFileDownload
} from 'react-icons/fa';
import { format } from 'date-fns';

const CommissionsTab = () => {
  const commissions = useSelector(selectReferralCommissions);
  const stats = useSelector(selectReferralStats);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  // Filter commissions based on status and date range
  const filteredCommissions = commissions.filter(commission => {
    // Filter by status
    if (filterStatus !== 'all' && commission.status !== filterStatus) {
      return false;
    }
    
    // Filter by date range
    if (dateRange !== 'all') {
      const commissionDate = new Date(commission.date);
      const now = new Date();
      
      switch(dateRange) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return commissionDate >= today;
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return commissionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return commissionDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return commissionDate >= yearAgo;
        default:
          return true;
      }
    }
    
    return true;
  });
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-500 border border-green-500">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-500 border border-yellow-500">
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-500 border border-blue-500">
            Processing
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/30 text-gray-400 border border-gray-500">
            {status}
          </span>
        );
    }
  };
  
  return (
    <div>
      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-900/30 mr-4">
              <FaMoneyBillWave className="text-primary-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Earnings</p>
              <p className="text-xl font-bold text-gray-100">{formatCurrency(stats.totalEarnings)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-900/30 mr-4">
              <FaArrowDown className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Paid Commissions</p>
              <p className="text-xl font-bold text-green-500">{formatCurrency(stats.paidCommissions)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-900/30 mr-4">
              <FaArrowUp className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending Commissions</p>
              <p className="text-xl font-bold text-yellow-500">{formatCurrency(stats.pendingCommissions)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-900/30 mr-4">
              <FaCircle className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Commission Rate</p>
              <p className="text-xl font-bold text-blue-500">{stats.commissionRate}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Actions Row */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
          </select>
          
          <select
            className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700">
            <FaFileExport className="mr-2" />
            <span>Export</span>
          </button>
          <button className="flex items-center bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700">
            <FaFileDownload className="mr-2" />
            <span>Download</span>
          </button>
        </div>
      </div>
      
      {/* Commissions Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Referral
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Commission
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredCommissions.length > 0 ? (
              filteredCommissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {format(new Date(commission.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {commission.referralName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {commission.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatCurrency(commission.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-500">
                    {formatCurrency(commission.commission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(commission.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      className="text-primary-500 hover:text-primary-400"
                      title="View details"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                  No commissions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Commission Policy Information */}
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-200 mb-2 flex items-center">
          <FaMoneyBillWave className="mr-2 text-primary-500" /> 
          Commission Policy
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300 pl-4 text-sm">
          <li>You earn {stats.commissionRate}% on all deposits made by your referrals.</li>
          <li>Trading commissions are paid instantly when your referral makes a trade.</li>
          <li>Deposit commissions are paid after a 24-hour holding period.</li>
          <li>Withdrawal requests for commission earnings are processed within 1-2 business days.</li>
          <li>Minimum withdrawal amount is $50.</li>
        </ul>
      </div>
    </div>
  );
};

export default CommissionsTab;
