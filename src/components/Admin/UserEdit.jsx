import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, 
  FaSave, 
  FaArrowLeft, 
  FaExclamationTriangle,
  FaCheck 
} from 'react-icons/fa';
import { fetchUserById, updateUser, selectSelectedUser, selectUsersStatus } from '../../redux/slices/adminUsersSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';

const UserEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();
  
  const user = useSelector(selectSelectedUser);
  const status = useSelector(selectUsersStatus);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    accountType: '',
    status: '',
    tradingEnabled: true
  });
  
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Country list for dropdown
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'IN', name: 'India' },
    { code: 'CN', name: 'China' },
    { code: 'JP', name: 'Japan' }
  ];
  
  // Account type options
  const accountTypes = [
    { value: 'individual', label: 'Individual Account' },
    { value: 'business', label: 'Business Account' },
    { value: 'premium', label: 'Premium Account' },
    { value: 'vip', label: 'VIP Account' }
  ];
  
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending_verification', label: 'Pending Verification' },
    { value: 'suspended', label: 'Suspended' }
  ];
  
  useEffect(() => {
    document.title = "Edit User | Admin Dashboard";
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);
  
  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      console.log("Loading user data into form:", user);
      
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        accountType: user.accountType || '',
        status: user.status || 'active',
        tradingEnabled: user.tradingEnabled !== undefined ? user.tradingEnabled : true
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    try {
      await dispatch(updateUser({ userId, userData: formData })).unwrap();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to update user:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.message || 'Failed to update user. Please try again.' 
      }));
    } finally {
      setSaving(false);
    }
  };
  
  if (status === 'loading') {
    return <ComponentLoader height="600px" message="Loading user data..." />;
  }
  
  if (status === 'failed') {
    return (
      <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <FaExclamationTriangle className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-yellow-500' : 'text-yellow-400'}`} />
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Failed to load user data</h3>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>There was an error loading the user details. Please try again.</p>
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
  
  if (!user) {
    return (
      <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <FaExclamationTriangle className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-yellow-500' : 'text-yellow-400'}`} />
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>User not found</h3>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>The user you are looking for does not exist or was deleted.</p>
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
              Update user information and settings
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
              <FaArrowLeft className="mr-2" /> Back to User Profile
            </button>
          </div>
        </div>
        
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className={`h-12 w-12 rounded-full mr-4 flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <FaUser className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.firstName} {user.lastName}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Success message */}
            {saveSuccess && (
              <div className={`mb-6 p-4 rounded-md ${
                darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-800'
              }`}>
                <p className="flex items-center">
                  <FaCheck className="mr-2" /> User information successfully updated
                </p>
              </div>
            )}
            
            {/* Form error message */}
            {errors.submit && (
              <div className={`mb-6 p-4 rounded-md ${
                darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-800'
              }`}>
                <p className="flex items-center">
                  <FaExclamationTriangle className="mr-2" /> {errors.submit}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Personal Information
                </h3>
                
                <div className="mb-4">
                  <label htmlFor="firstName" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="lastName" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Not provided"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="country" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Account Settings Section */}
              <div>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Account Settings
                </h3>
                
                <div className="mb-4">
                  <label htmlFor="accountType" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Account Type
                  </label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType || ''}
                    onChange={handleChange}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select Account Type</option>
                    {accountTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {!formData.accountType && "Account type not set"}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="status" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Account Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.status ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tradingEnabled"
                      name="tradingEnabled"
                      checked={formData.tradingEnabled}
                      onChange={handleChange}
                      className={`h-4 w-4 rounded ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                      } text-primary-600 focus:ring-primary-500`}
                    />
                    <label htmlFor="tradingEnabled" className={`ml-2 block text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Enable Trading
                    </label>
                  </div>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Allow this user to access trading features.
                  </p>
                </div>
                
                <div className={`mt-8 p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    KYC Verification Status
                  </h4>
                  <div className={`text-sm ${
                    user.kycVerified 
                      ? 'text-green-500' 
                      : user.kycStatus === 'pending' 
                        ? 'text-yellow-500' 
                        : 'text-red-500'
                  }`}>
                    {user.kycVerified 
                      ? 'Verified' 
                      : user.kycStatus === 'pending' 
                        ? 'Verification Pending' 
                        : 'Not Verified'}
                  </div>
                  <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.kycVerified 
                      ? 'User has completed identity verification.' 
                      : user.kycStatus === 'pending' 
                        ? 'User has submitted verification documents. Review required.' 
                        : 'User has not submitted KYC verification documents.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/admin/users/${userId}`)}
                className={`mr-3 px-4 py-2 border rounded-md ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md flex items-center ${
                  saving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={saving}
              >
                <FaSave className="mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserEdit;
