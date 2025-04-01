import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaExchangeAlt, 
  FaIdCard, 
  FaTicketAlt, 
  FaArrowUp, 
  FaArrowDown,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight
} from 'react-icons/fa';
import { fetchUsers } from '../../redux/slices/adminUsersSlice';
import { fetchTransactions } from '../../redux/slices/adminTransactionsSlice';
import { fetchKycRequests } from '../../redux/slices/adminKycSlice';
import { fetchSupportTickets } from '../../redux/slices/adminSupportSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';

const AdminDashboard = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, pending: 0 },
    transactions: { total: 0, pending: 0, completed: 0, failed: 0 },
    kyc: { total: 0, pending: 0, approved: 0, rejected: 0 },
    tickets: { total: 0, open: 0, resolved: 0 }
  });
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentKycRequests, setRecentKycRequests] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  
  useEffect(() => {
    document.title = "Admin Dashboard | Fidelity First Brokers";
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch users data
        const usersResponse = await dispatch(fetchUsers({ page: 1, limit: 50 })).unwrap();
        
        // Fetch transactions data
        const transactionsResponse = await dispatch(fetchTransactions({ page: 1, limit: 50 })).unwrap();
        
        // Fetch KYC requests data
        const kycResponse = await dispatch(fetchKycRequests({ page: 1, limit: 50 })).unwrap();
        
        // Fetch support tickets data
        const supportResponse = await dispatch(fetchSupportTickets({ page: 1, limit: 50 })).unwrap();
        
        // Calculate statistics
        const userStats = {
          total: usersResponse.pagination.totalUsers,
          active: usersResponse.users.filter(u => u.status === 'active').length,
          pending: usersResponse.users.filter(u => u.status === 'pending_verification').length
        };
        
        const transactionStats = {
          total: transactionsResponse.pagination.totalTransactions,
          pending: transactionsResponse.transactions.filter(t => t.status === 'pending').length,
          completed: transactionsResponse.transactions.filter(t => t.status === 'completed').length,
          failed: transactionsResponse.transactions.filter(t => t.status === 'failed' || t.status === 'rejected').length
        };
        
        const kycStats = {
          total: kycResponse.pagination.totalRequests,
          pending: kycResponse.kycRequests.filter(k => k.status === 'pending').length,
          approved: kycResponse.kycRequests.filter(k => k.status === 'approved').length,
          rejected: kycResponse.kycRequests.filter(k => k.status === 'rejected').length
        };
        
        const ticketStats = {
          total: supportResponse.pagination.totalTickets,
          open: supportResponse.supportTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
          resolved: supportResponse.supportTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
        };
        
        setStats({
          users: userStats,
          transactions: transactionStats,
          kyc: kycStats,
          tickets: ticketStats
        });
        
        // Set recent items
        setRecentTransactions(transactionsResponse.transactions.slice(0, 5));
        setRecentKycRequests(kycResponse.kycRequests.slice(0, 5));
        setRecentTickets(supportResponse.supportTickets.slice(0, 5));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [dispatch]);
  
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
      case 'resolved':
      case 'closed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        );
      case 'pending':
      case 'in_progress':
      case 'waiting_for_documents':
      case 'responded':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        );
      case 'failed':
      case 'rejected':
      case 'suspended':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };
  
  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Overview of platform metrics and recent activity
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            <ComponentLoader height="120px" message="Loading dashboard metrics..." />
            <ComponentLoader height="400px" message="Loading recent activity..." />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Users Stats */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Users</h3>
                  <div className={`p-2 rounded-full ${
                    darkMode ? 'bg-blue-900/20' : 'bg-blue-100'
                  }`}>
                    <FaUsers className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <p className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.users.total}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Active: {stats.users.active}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Pending: {stats.users.pending}</span>
                  </div>
                </div>
              </div>
              
              {/* Transactions Stats */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transactions</h3>
                  <div className={`p-2 rounded-full ${
                    darkMode ? 'bg-green-900/20' : 'bg-green-100'
                  }`}>
                    <FaExchangeAlt className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <p className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.transactions.total}
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Pending</span>
                    <span className="font-medium text-yellow-500">{stats.transactions.pending}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Completed</span>
                    <span className="font-medium text-green-500">{stats.transactions.completed}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Failed</span>
                    <span className="font-medium text-red-500">{stats.transactions.failed}</span>
                  </div>
                </div>
              </div>
              
              {/* KYC Stats */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>KYC Requests</h3>
                  <div className={`p-2 rounded-full ${
                    darkMode ? 'bg-purple-900/20' : 'bg-purple-100'
                  }`}>
                    <FaIdCard className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <p className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.kyc.total}
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Pending</span>
                    <span className="font-medium text-yellow-500">{stats.kyc.pending}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Approved</span>
                    <span className="font-medium text-green-500">{stats.kyc.approved}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Rejected</span>
                    <span className="font-medium text-red-500">{stats.kyc.rejected}</span>
                  </div>
                </div>
              </div>
              
              {/* Support Tickets Stats */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Support Tickets</h3>
                  <div className={`p-2 rounded-full ${
                    darkMode ? 'bg-orange-900/20' : 'bg-orange-100'
                  }`}>
                    <FaTicketAlt className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
                <p className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.tickets.total}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Open</span>
                    <span className="font-medium text-yellow-500">{stats.tickets.open}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Resolved</span>
                    <span className="font-medium text-green-500">{stats.tickets.resolved}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <div className={`rounded-lg overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Transactions
                  </h3>
                  <Link 
                    to="/admin/transactions" 
                    className="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                  >
                    View All <FaArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentTransactions.length === 0 ? (
                    <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No transactions found
                    </div>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="px-6 py-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              transaction.type === 'deposit' 
                                ? darkMode ? 'bg-green-900/20' : 'bg-green-100' 
                                : transaction.type === 'withdrawal' 
                                  ? darkMode ? 'bg-red-900/20' : 'bg-red-100'
                                  : darkMode ? 'bg-blue-900/20' : 'bg-blue-100'
                            }`}>
                              {transaction.type === 'deposit' ? (
                                <FaArrowDown className="h-4 w-4 text-green-500" />
                              ) : transaction.type === 'withdrawal' ? (
                                <FaArrowUp className="h-4 w-4 text-red-500" />
                              ) : (
                                <FaExchangeAlt className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              transaction.type === 'deposit' 
                                ? 'text-green-500' 
                                : transaction.type === 'withdrawal' 
                                  ? 'text-red-500'
                                  : darkMode ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                              {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}{transaction.amount} {transaction.currency}
                            </p>
                            <div className="mt-1">
                              {renderStatusBadge(transaction.status)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {transaction.user.fullName}
                          </p>
                          <Link 
                            to={`/admin/transactions/${transaction.id}`} 
                            className="text-primary-500 hover:text-primary-600 text-xs flex items-center"
                          >
                            <FaEye className="mr-1 h-3 w-3" /> View
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Recent KYC Requests */}
              <div className={`rounded-lg overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent KYC Requests
                  </h3>
                  <Link 
                    to="/admin/kyc" 
                    className="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                  >
                    View All <FaArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentKycRequests.length === 0 ? (
                    <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No KYC requests found
                    </div>
                  ) : (
                    recentKycRequests.map((kyc) => (
                      <div key={kyc.id} className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <span className="text-primary-500 font-semibold">
                                {kyc.user.fullName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {kyc.user.fullName}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {kyc.user.email}
                              </p>
                            </div>
                          </div>
                          <div>
                            {renderStatusBadge(kyc.status)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Submitted: {new Date(kyc.submittedAt).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            {kyc.status === 'pending' && (
                              <>
                                <Link
                                  to={`/admin/kyc/${kyc.id}?action=approve`}
                                  className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                >
                                  <FaCheckCircle className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={`/admin/kyc/${kyc.id}?action=reject`}
                                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                >
                                  <FaTimesCircle className="h-4 w-4" />
                                </Link>
                              </>
                            )}
                            <Link
                              to={`/admin/kyc/${kyc.id}`}
                              className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                            >
                              <FaEye className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Recent Support Tickets */}
              <div className={`rounded-lg overflow-hidden lg:col-span-2 ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Support Tickets
                  </h3>
                  <Link 
                    to="/admin/support" 
                    className="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                  >
                    View All <FaArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {recentTickets.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No support tickets found
                          </td>
                        </tr>
                      ) : (
                        recentTickets.map((ticket) => (
                          <tr key={ticket.id} className={darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium truncate max-w-xs">{ticket.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">{ticket.user.fullName}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{ticket.user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                ticket.priority === 'high' || ticket.priority === 'urgent'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : ticket.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              }`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderStatusBadge(ticket.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <Link
                                to={`/admin/support/${ticket.id}`}
                                className="text-primary-500 hover:text-primary-600"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
