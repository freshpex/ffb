import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaSave, 
  FaTimes, 
  FaArrowLeft, 
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { 
  fetchUserById, 
  updateUser, 
  selectSelectedUser, 
  selectUsersStatus, 
  selectUserActionStatus 
} from '../../redux/slices/adminUsersSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';
import Alert from '../common/Alert';

const UserEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();
  
  const user = useSelector(selectSelectedUser);
  const status = useSelector(selectUsersStatus);
  const actionStatus = useSelector(selectUserActionStatus);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    status: 'active'
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    document.title = "Edit User | Admin Dashboard";
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);
  
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        status: user.status || 'active'
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await dispatch(updateUser({
        userId,
        userData: formData
      })).unwrap();
      
      setSuccess('User information updated successfully');
      setTimeout(() => {
        navigate(`/admin/users/${userId}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };
  
  if (status === 'loading') {
    return <ComponentLoader height="500px" message="Loading user details..." />;
  }
  
  if (!user && status !== 'loading') {
    return (
      <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <FaExclamationTriangle className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-yellow-500' : 'text-yellow-400'}`} />
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>User not found</h3>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>The user you are looking for does not exist or was removed.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/admin/users')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back to Users
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Edit User
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Update {user.fullName}'s information
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate(`/admin/users/${userId}`)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaArrowLeft className="mr-2" /> Back to User Details
            </button>
          </div>
        </div>
        
        {success && <Alert type="success" message={success} />}
        {error && <Alert type="error" message={error} />}
        
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        }`}>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              User Information
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`block w-full pl-10 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                    } border`}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                    } border`}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                    } border`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`block w-full pl-10 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                    } border`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Account Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`block w-full py-2 rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                  } border`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending_verification">Pending Verification</option>
                </select>
              </div>
            </div>
            
            <div className={`mt-6 p-4 rounded-md ${
              darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex">
                <FaInfoCircle className={`flex-shrink-0 h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'} mt-0.5`} />
                <div className="ml-3">
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Changes to email address will require verification. The user will be notified about these changes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/admin/users/${userId}`)}
                className={`px-4 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <FaTimes className="inline mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={actionStatus === 'loading'}
                className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md ${
                  actionStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {actionStatus === 'loading' ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="inline mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserEdit;
