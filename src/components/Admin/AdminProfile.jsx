import { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaLock, 
  FaUserShield, 
  FaHistory, 
  FaIdBadge,
  FaUserCog,
  FaSave,
  FaCamera
} from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import Tabs from '../common/Tabs';
import Alert from '../common/Alert';

const AdminProfile = () => {
  const { darkMode } = useDarkMode();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Mock admin data
  const adminData = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@fidelityfirst.com',
    phone: '+1 (555) 123-4567',
    role: 'System Administrator',
    permissions: ['users_manage', 'transactions_approve', 'kyc_verify', 'support_manage', 'settings_edit'],
    joinedAt: '2021-09-10T10:00:00Z',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    timezone: 'America/New_York',
    profileImage: 'https://randomuser.me/api/portraits/men/24.jpg'
  };
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser className="mr-2" /> },
    { id: 'security', label: 'Security', icon: <FaLock className="mr-2" /> },
    { id: 'permissions', label: 'Permissions', icon: <FaUserShield className="mr-2" /> },
    { id: 'activity', label: 'Activity Log', icon: <FaHistory className="mr-2" /> }
  ];
  
  // Mock activity logs
  const activityLogs = [
    { id: 'log-1', action: 'Logged in', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), ip: '192.168.1.1' },
    { id: 'log-2', action: 'Approved transaction tx-24', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), ip: '192.168.1.1' },
    { id: 'log-3', action: 'Updated user settings for John Doe', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), ip: '192.168.1.1' },
    { id: 'log-4', action: 'Verified KYC documents for Emma Wilson', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), ip: '192.168.1.1' },
    { id: 'log-5', action: 'System settings updated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), ip: '192.168.1.1' }
  ];
  
  const [profileData, setProfileData] = useState({
    name: adminData.name,
    email: adminData.email,
    phone: adminData.phone,
    timezone: adminData.timezone
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 500);
  };
  
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 500);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };
  
  return (
    <PageTransition>
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My Profile
        </h1>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          View and update your account information
        </p>
        
        {message.text && (
          <Alert 
            type={message.type} 
            message={message.text} 
            onDismiss={() => setMessage({ type: '', text: '' })} 
          />
        )}
        
        <div className={`rounded-lg overflow-hidden ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow'
        }`}>
          <div className="p-6 flex flex-col md:flex-row items-center md:items-start border-b border-gray-200 dark:border-gray-700">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img 
                src={adminData.profileImage} 
                alt={adminData.name} 
                className="h-24 w-24 rounded-full object-cover border-2 border-primary-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${adminData.name.replace(' ', '+')}&background=0D8ABC&color=fff&size=100`;
                }}
              />
              <button className={`absolute bottom-0 right-0 p-1.5 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}>
                <FaCamera className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
            
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {adminData.name}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {adminData.email}
              </p>
              <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ${
                darkMode ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-800'
              }`}>
                <FaIdBadge className="mr-1" /> {adminData.role}
              </div>
              <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Member since {new Date(adminData.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate}>
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
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
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
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
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
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        </div>
                        <input
                          type="text"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
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
                        Timezone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaGlobe className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        </div>
                        <select
                          name="timezone"
                          value={profileData.timezone}
                          onChange={handleProfileChange}
                          className={`block w-full pl-10 py-2 rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                          } border`}
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="UTC">UTC</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Paris (CET)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordUpdate}>
                  <div className="max-w-md">
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Change Password
                    </h3>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`block w-full pl-10 py-2 rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                          } border`}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`block w-full pl-10 py-2 rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                          } border`}
                          required
                        />
                      </div>
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Password must be at least 8 characters long with at least one lowercase, one uppercase, one number, and one special character.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`block w-full pl-10 py-2 rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                          } border`}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                      >
                        <FaSave className="mr-2" /> Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className={`mt-8 p-4 rounded-lg ${
                    darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-2 flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                      <FaUserCog className="mr-2" /> Two-Factor Authentication
                    </h4>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      Enhance your account security by enabling two-factor authentication.
                    </p>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded text-sm ${
                        darkMode 
                          ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      Configure 2FA
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'permissions' && (
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Role & Permissions
                  </h3>
                  
                  <div className={`mb-6 p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Current Role
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-800'
                      }`}>
                        {adminData.role}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      As a System Administrator, you have full access to all features and functionalities of the platform.
                    </p>
                  </div>
                  
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Permissions
                  </h4>
                  
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                    } flex justify-between items-center`}>
                      <div>
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          User Management
                        </h5>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Create, edit, and manage user accounts
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                      }`}>
                        Granted
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                    } flex justify-between items-center`}>
                      <div>
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Transaction Approval
                        </h5>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Approve, reject, and manage deposits and withdrawals
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                      }`}>
                        Granted
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                    } flex justify-between items-center`}>
                      <div>
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          KYC Verification
                        </h5>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Review and verify user identity documents
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                      }`}>
                        Granted
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                    } flex justify-between items-center`}>
                      <div>
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Support Management
                        </h5>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Respond to and manage support tickets
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                      }`}>
                        Granted
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                    } flex justify-between items-center`}>
                      <div>
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Settings Management
                        </h5>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Configure and edit system settings
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                      }`}>
                        Granted
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Activity Log
                  </h3>
                  
                  <div className="space-y-4">
                    {activityLogs.map((log) => (
                      <div 
                        key={log.id}
                        className={`p-3 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="mb-2 sm:mb-0">
                            <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {log.action}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {log.ip}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(log.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminProfile;
