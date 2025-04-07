import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaEdit, 
  FaLock, 
  FaEnvelope,
  FaCheck,
  FaArrowRight
} from 'react-icons/fa';
import { fetchUsers, selectUsers, selectUsersPagination, selectUsersStatus } from '../../redux/slices/adminUsersSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';
import Pagination from './common/Pagination';
import StatusBadge from './common/StatusBadge';
import SearchFilter from './common/SearchFilter';

const AdminUsers = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();
  
  const users = useSelector(selectUsers);
  const pagination = useSelector(selectUsersPagination);
  const status = useSelector(selectUsersStatus);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const isLoading = status === 'loading';
  
  useEffect(() => {
    document.title = "User Management | Admin Dashboard";
    if (users.length > 0) {
      console.log("User object structure:", users[0]);
    }
    loadUsers();
  }, [page, limit]);
  
  const loadUsers = () => {
    dispatch(fetchUsers({ 
      page, 
      limit, 
      search: searchTerm, 
      status: statusFilter 
    }));
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleSearch = ({ searchTerm: search, filters }) => {
    setSearchTerm(search);
    setStatusFilter(filters.status);
    setPage(1); // Reset to first page when applying new search/filters
    
    dispatch(fetchUsers({ 
      page: 1,
      limit, 
      search, 
      status: filters.status 
    }));
  };
  
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when changing limit
  };
  
  // Define status filter options
  const statusFilterOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending_verification', label: 'Pending Verification' },
    { value: 'suspended', label: 'Suspended' }
  ];
  
  // Format date to local format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format currency with commas and two decimal places
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            User Management
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            View and manage user accounts
          </p>
        </div>
        
        <SearchFilter
          onSearch={handleSearch}
          searchPlaceholder="Search by name, email or account number..."
          filters={[
            {
              id: 'status',
              label: 'Status',
              options: statusFilterOptions,
              defaultValue: '',
              placeholder: 'All Statuses'
            }
          ]}
          className="mb-6"
        />
        
        {isLoading ? (
          <ComponentLoader height="400px" message="Loading users..." />
        ) : (
          <div>
            <div className={`rounded-lg overflow-hidden ${
              darkMode ? 'border border-gray-700' : 'border border-gray-200 shadow-md'
            }`}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Users List
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
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Account Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Verification
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <p className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No users found
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Try adjusting your search or filter to find what you're looking for.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr 
                          key={user._id || user.id || `user-${Math.random()}`} 
                          className={darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                {user.profileImage ? (
                                  <img 
                                    src={user.profileImage} 
                                    alt={user.fullName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `https://ui-avatars.com/api/?name=${user.fullName.replace(' ', '+')}&background=0D8ABC&color=fff`;
                                    }}
                                  />
                                ) : (
                                  <div className={`h-full w-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <span className="text-primary-500 font-semibold">
                                      {user.fullName && user.fullName.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium">{user.fullName}</div>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <FaEnvelope className="mr-1" size={10} />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{user.accountNumber}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user.country}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              user.balance > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : darkMode ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                              {formatCurrency(user.balance)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm ${user.kycVerified 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                              }`}>
                                {user.kycVerified ? (
                                  <span className="flex items-center">
                                    <FaCheck className="mr-1" size={12} /> Verified
                                  </span>
                                ) : 'Not Verified'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/users/${user._id || user.id}`}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                                title="View User"
                              >
                                <FaEye size={14} />
                              </Link>
                              <Link
                                to={`/admin/users/${user._id || user.id}/edit`}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                                    : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                }`}
                                title="Edit User"
                              >
                                <FaEdit size={14} />
                              </Link>
                              <Link
                                to={`/admin/users/${user._id || user.id}/security`}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title="Security Settings"
                              >
                                <FaLock size={14} />
                              </Link>
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
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages || 0}
                  totalItems={pagination.totalUsers || 0}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className={`mt-6 p-4 rounded-lg ${
              darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/users/new"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Add New User
                </Link>
                <Link
                  to="/admin/bulk-import"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Import Users
                </Link>
                <Link
                  to="/admin/bulk-export"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Export Users
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminUsers;
