import { useState } from 'react';
import { FaCog, FaKey, FaShieldAlt, FaBell, FaGlobe, FaDatabase, FaSave, FaCheck } from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import Tabs from '../common/Tabs';
import Alert from '../common/Alert';

const AdminSettings = () => {
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('general');
  const [success, setSuccess] = useState('');
  
  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog className="mr-2" /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt className="mr-2" /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell className="mr-2" /> },
    { id: 'system', label: 'System', icon: <FaDatabase className="mr-2" /> },
  ];
  
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccess('Settings saved successfully');
    
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  return (
    <PageTransition>
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Admin Settings
        </h1>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure and customize your admin dashboard settings
        </p>
        
        {success && <Alert type="success" message={success} onDismiss={() => setSuccess('')} />}
        
        <div className={`rounded-lg overflow-hidden ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow'
        }`}>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="p-6">
            {activeTab === 'general' && (
              <form onSubmit={handleSaveSettings}>
                <div className="mb-6">
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    General Settings
                  </h3>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Dashboard Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Fidelity First Admin"
                      className={`block w-full max-w-lg p-2 rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                      } border`}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Default Language
                    </label>
                    <div className="max-w-lg">
                      <select
                        className={`block w-full p-2 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                        } border`}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date Format
                    </label>
                    <div className="max-w-lg">
                      <select
                        className={`block w-full p-2 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                        } border`}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="darkMode"
                      defaultChecked={darkMode}
                      className={`rounded ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                      } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                    />
                    <label htmlFor="darkMode" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Enable Dark Mode by Default
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                >
                  <FaSave className="mr-2" /> Save Settings
                </button>
              </form>
            )}
            
            {activeTab === 'security' && (
              <form onSubmit={handleSaveSettings}>
                <div className="mb-6">
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Security Settings
                  </h3>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Two-factor Authentication
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="twoFactor"
                        defaultChecked={true}
                        className={`rounded ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                        } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                      />
                      <label htmlFor="twoFactor" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Require two-factor authentication for all admin users
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Password Requirements
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="minLength"
                          defaultChecked={true}
                          className={`rounded ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                          } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                        />
                        <label htmlFor="minLength" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Minimum 8 characters
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="uppercase"
                          defaultChecked={true}
                          className={`rounded ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                          } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                        />
                        <label htmlFor="uppercase" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          At least one uppercase letter
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="number"
                          defaultChecked={true}
                          className={`rounded ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                          } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                        />
                        <label htmlFor="number" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          At least one number
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="special"
                          defaultChecked={true}
                          className={`rounded ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                          } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                        />
                        <label htmlFor="special" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          At least one special character
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      min={5}
                      max={120}
                      className={`block w-full max-w-xs p-2 rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                      } border`}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                >
                  <FaSave className="mr-2" /> Save Settings
                </button>
              </form>
            )}
            
            {activeTab === 'notifications' && (
              <form onSubmit={handleSaveSettings}>
                <div className="mb-6">
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Notification Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Notifications
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNewUser"
                            defaultChecked={true}
                            className={`rounded ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                            } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                          />
                          <label htmlFor="emailNewUser" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            New user registrations
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailLargeDeposit"
                            defaultChecked={true}
                            className={`rounded ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                            } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                          />
                          <label htmlFor="emailLargeDeposit" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Large deposits ($10,000+)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailLargeWithdrawal"
                            defaultChecked={true}
                            className={`rounded ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                            } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                          />
                          <label htmlFor="emailLargeWithdrawal" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Large withdrawals ($5,000+)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailKycSubmission"
                            defaultChecked={true}
                            className={`rounded ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                            } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                          />
                          <label htmlFor="emailKycSubmission" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            KYC submission
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        In-App Notifications
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="inAppSupportTicket"
                            defaultChecked={true}
                            className={`rounded ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                            } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                          />
                          <label htmlFor="inAppSupportTicket" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            New support tickets
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="inAppFailedLogin"
                            defaultChecked={true}
                            className={`rounded ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                            } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                          />
                          <label htmlFor="inAppFailedLogin" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Failed login attempts
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="inAppSystemAlerts"
                            defaultChecked={true}
                            className={`rounded ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                            } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                          />
                          <label htmlFor="inAppSystemAlerts" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            System alerts
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                >
                  <FaSave className="mr-2" /> Save Settings
                </button>
              </form>
            )}
            
            {activeTab === 'system' && (
              <form onSubmit={handleSaveSettings}>
                <div className="mb-6">
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    System Settings
                  </h3>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Maintenance Mode
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        className={`rounded ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                        } text-primary-600 focus:ring-primary-500 h-4 w-4`}
                      />
                      <label htmlFor="maintenanceMode" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Enable maintenance mode
                      </label>
                    </div>
                    <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      When enabled, the site will show a maintenance page to all non-admin users.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Default Currency
                    </label>
                    <div className="max-w-lg">
                      <select
                        className={`block w-full p-2 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                        } border`}
                        defaultValue="USD"
                      >
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                        <option value="JPY">Japanese Yen (JPY)</option>
                        <option value="AUD">Australian Dollar (AUD)</option>
                        <option value="CAD">Canadian Dollar (CAD)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Data Retention Period (days)
                    </label>
                    <input
                      type="number"
                      defaultValue={90}
                      min={30}
                      max={365}
                      className={`block w-full max-w-xs p-2 rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                      } border`}
                    />
                    <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Activity logs and system events will be automatically purged after this period.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Default Timezone
                    </label>
                    <div className="max-w-lg">
                      <select
                        className={`block w-full p-2 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                        } border`}
                        defaultValue="UTC"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                >
                  <FaSave className="mr-2" /> Save Settings
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminSettings;
