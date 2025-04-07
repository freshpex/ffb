import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaCog, 
  FaSave, 
  FaTrash, 
  FaPlus, 
  FaUndo, 
  FaShieldAlt, 
  FaEnvelope, 
  FaCreditCard, 
  FaIdCard, 
  FaExchangeAlt, 
  FaPaintBrush, 
  FaBell, 
  FaWrench,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  fetchAllSettings, 
  fetchSettingsByCategory,
  updateSettings,
  createSetting,
  deleteSetting,
  resetToDefaults,
  selectAllSettings,
  selectSettingsByCategory,
  selectCategories,
  selectAdminSettingsStatus,
  selectAdminSettingsActionStatus,
  selectAdminSettingsError
} from '../../redux/slices/adminSettingsSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';

const AdminSettings = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();
  
  // Redux state
  const allSettings = useSelector(selectAllSettings);
  const categories = useSelector(selectCategories);
  const status = useSelector(selectAdminSettingsStatus);
  const actionStatus = useSelector(selectAdminSettingsActionStatus);
  const error = useSelector(selectAdminSettingsError);
  
  // Local state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editedSettings, setEditedSettings] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showNewSettingForm, setShowNewSettingForm] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    description: '',
    type: 'string',
    category: '',
    options: []
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Load all settings on component mount
  useEffect(() => {
    document.title = "System Settings | Admin Dashboard";
    
    // First load all settings to get an overview
    dispatch(fetchAllSettings());
  }, [dispatch]);
  
  // When a category is selected, fetch its specific settings
  useEffect(() => {
    if (selectedCategory) {
      console.log("Fetching settings for category:", selectedCategory);
      dispatch(fetchSettingsByCategory(selectedCategory));
    }
  }, [selectedCategory, dispatch]);
  
  // Get icon for category
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'general':
        return <FaCog />;
      case 'security':
        return <FaShieldAlt />;
      case 'email':
        return <FaEnvelope />;
      case 'payment':
        return <FaCreditCard />;
      case 'kyc':
        return <FaIdCard />;
      case 'trading':
        return <FaExchangeAlt />;
      case 'ui':
        return <FaPaintBrush />;
      case 'notifications':
        return <FaBell />;
      case 'advanced':
        return <FaWrench />;
      default:
        return <FaCog />;
    }
  };
  
  // Handle category click
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // Handle setting value change
  const handleSettingChange = (key, value) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    const settingsToUpdate = Object.entries(editedSettings).map(([key, value]) => ({
      key,
      value
    }));
    
    if (settingsToUpdate.length > 0) {
      dispatch(updateSettings(settingsToUpdate));
      // Clear edited settings after save
      setEditedSettings({});
    }
  };
  
  // Handle new setting change
  const handleNewSettingChange = (field, value) => {
    setNewSetting(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle add new setting
  const handleAddSetting = () => {
    // Validate form
    if (!newSetting.key || !newSetting.value || !newSetting.description || !newSetting.category) {
      alert('Please fill in all required fields.');
      return;
    }
    
    dispatch(createSetting(newSetting));
    
    // Reset form and hide it after submission
    setNewSetting({
      key: '',
      value: '',
      description: '',
      type: 'string',
      category: '',
      options: []
    });
    setShowNewSettingForm(false);
  };
  
  // Handle delete setting
  const handleDeleteSetting = (key) => {
    dispatch(deleteSetting(key));
    setShowDeleteConfirm(null);
  };
  
  // Handle reset to defaults
  const handleResetToDefaults = () => {
    dispatch(resetToDefaults());
    setShowResetConfirm(false);
  };
  
  // Get settings for current category
  const currentCategorySettings = useSelector(state => 
    selectSettingsByCategory(state, selectedCategory)
  );
  
  // Check if we have settings for the current category
  const hasSettings = Object.keys(currentCategorySettings || {}).length > 0;
  
  // Format setting value based on type
  const getFormattedValue = (setting) => {
    switch (setting.type) {
      case 'boolean':
        return setting.value === true || setting.value === 'true' ? 'Enabled' : 'Disabled';
      case 'number':
        return setting.value;
      case 'array':
        try {
          return Array.isArray(setting.value) 
            ? setting.value.join(', ') 
            : typeof setting.value === 'string' 
              ? setting.value
              : JSON.stringify(setting.value);
        } catch (e) {
          return String(setting.value);
        }
      default:
        return String(setting.value);
    }
  };
  
  // Render input based on setting type
  const renderSettingInput = (setting, key) => {
    const currentValue = editedSettings[key] !== undefined 
      ? editedSettings[key] 
      : setting.value;
    
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className={`sr-only peer`}
                checked={currentValue === true || currentValue === 'true'}
                onChange={e => handleSettingChange(key, e.target.checked)}
              />
              <div className={`w-11 h-6 rounded-full peer 
                ${darkMode 
                  ? 'bg-gray-700 peer-checked:bg-primary-600' 
                  : 'bg-gray-200 peer-checked:bg-primary-600'} 
                peer-focus:outline-none peer-focus:ring-4 
                ${darkMode 
                  ? 'peer-focus:ring-primary-800' 
                  : 'peer-focus:ring-primary-300'} 
                peer-checked:after:translate-x-full peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all relative`}
              />
            </label>
          </div>
        );
      
      case 'select':
        return (
          <select
            value={currentValue}
            onChange={e => handleSettingChange(key, e.target.value)}
            className={`rounded-md w-full ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {setting.options && setting.options.map((option, idx) => (
              <option key={idx} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            value={currentValue}
            onChange={e => handleSettingChange(key, e.target.value)}
            rows="3"
            className={`rounded-md w-full ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={currentValue}
            onChange={e => handleSettingChange(key, Number(e.target.value))}
            className={`rounded-md w-full ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        );
      
      case 'array':
        return (
          <textarea
            value={Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
            onChange={e => handleSettingChange(key, e.target.value.split(',').map(item => item.trim()))}
            rows="3"
            className={`rounded-md w-full ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Comma separated values"
          />
        );
      
      default: // string type
        return (
          <input
            type="text"
            value={currentValue}
            onChange={e => handleSettingChange(key, e.target.value)}
            className={`rounded-md w-full ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        );
    }
  };

  console.log("Selected category:", selectedCategory);
  console.log("Current category settings:", currentCategorySettings);
  console.log("All settings:", allSettings);
  
  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            System Settings
          </h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Configure application-wide settings and preferences
          </p>
        </div>
        
        {error && (
          <div className={`mb-6 p-4 rounded-md ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
          }`}>
            <p className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Categories
              </h2>
            </div>
            
            <div className="p-2">
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        selectedCategory === category.id
                          ? darkMode
                            ? 'bg-primary-600 text-white'
                            : 'bg-primary-50 text-primary-700'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3">{getCategoryIcon(category.id)}</span>
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowResetConfirm(true)}
                className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaUndo className="mr-2" />
                Reset to Defaults
              </button>
            </div>
          </div>
          
          {/* Settings Content */}
          <div className={`rounded-lg lg:col-span-3 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCategory 
                  ? categories.find(c => c.id === selectedCategory)?.name + ' Settings'
                  : 'Settings Configuration'
                }
              </h2>
              
              {selectedCategory && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowNewSettingForm(true)}
                    className="px-3 py-1 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700"
                  >
                    <FaPlus className="inline mr-1" /> New Setting
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6">
              {status === 'loading' ? (
                <ComponentLoader height="300px" message="Loading settings..." />
              ) : !selectedCategory ? (
                <div className="text-center py-10">
                  <FaCog className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Select a category to view settings
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Choose a category from the sidebar to view and edit settings
                  </p>
                </div>
              ) : !hasSettings ? (
                <div className="text-center py-10">
                  <FaCog className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    No settings found
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    This category doesn't have any settings yet
                  </p>
                  <button
                    onClick={() => setShowNewSettingForm(true)}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    <FaPlus className="inline mr-2" /> Add First Setting
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {Object.entries(currentCategorySettings).map(([key, setting]) => (
                      <div 
                        key={key} 
                        className={`p-4 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {setting.name || key}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {setting.description}
                            </p>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(key)}
                            className={`p-1 rounded-full ${
                              darkMode 
                                ? 'text-red-400 hover:bg-gray-600' 
                                : 'text-red-600 hover:bg-gray-200'
                            }`}
                            title="Delete Setting"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="mt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Current Value: </span>
                              <span>{getFormattedValue(setting)}</span>
                            </div>
                            <div>
                              {renderSettingInput(setting, key)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Save Button */}
                  {Object.keys(editedSettings).length > 0 && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        disabled={actionStatus === 'loading'}
                        className={`px-4 py-2 rounded-md ${
                          actionStatus === 'loading'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700'
                        } text-white`}
                      >
                        {actionStatus === 'loading' ? 'Saving...' : (
                          <>
                            <FaSave className="inline mr-2" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* New Setting Form Modal */}
      {showNewSettingForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add New Setting
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Key *
                    </label>
                    <input
                      type="text"
                      value={newSetting.key}
                      onChange={(e) => handleNewSettingChange('key', e.target.value)}
                      className={`rounded-md w-full ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="setting_key_name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description *
                    </label>
                    <input
                      type="text"
                      value={newSetting.description}
                      onChange={(e) => handleNewSettingChange('description', e.target.value)}
                      className={`rounded-md w-full ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Describe what this setting controls"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Type *
                    </label>
                    <select
                      value={newSetting.type}
                      onChange={(e) => handleNewSettingChange('type', e.target.value)}
                      className={`rounded-md w-full ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="string">Text</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean (On/Off)</option>
                      <option value="select">Select (Dropdown)</option>
                      <option value="textarea">Text Area</option>
                      <option value="array">Array (Comma Separated)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    <select
                      value={newSetting.category || selectedCategory}
                      onChange={(e) => handleNewSettingChange('category', e.target.value)}
                      className={`rounded-md w-full ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Value *
                    </label>
                    {newSetting.type === 'boolean' ? (
                      <div className="flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={newSetting.value === true || newSetting.value === 'true'}
                            onChange={e => handleNewSettingChange('value', e.target.checked)}
                          />
                          <div className={`w-11 h-6 rounded-full peer 
                            ${darkMode 
                              ? 'bg-gray-700 peer-checked:bg-primary-600' 
                              : 'bg-gray-200 peer-checked:bg-primary-600'} 
                            peer-focus:outline-none peer-focus:ring-4 
                            ${darkMode 
                              ? 'peer-focus:ring-primary-800' 
                              : 'peer-focus:ring-primary-300'} 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all relative`}
                          />
                        </label>
                      </div>
                    ) : newSetting.type === 'textarea' ? (
                      <textarea
                        value={newSetting.value}
                        onChange={(e) => handleNewSettingChange('value', e.target.value)}
                        rows="3"
                        className={`rounded-md w-full ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Setting value"
                      />
                    ) : newSetting.type === 'number' ? (
                      <input
                        type="number"
                        value={newSetting.value}
                        onChange={(e) => handleNewSettingChange('value', Number(e.target.value))}
                        className={`rounded-md w-full ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    ) : (
                      <input
                        type="text"
                        value={newSetting.value}
                        onChange={(e) => handleNewSettingChange('value', e.target.value)}
                        className={`rounded-md w-full ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Setting value"
                      />
                    )}
                  </div>
                  
                  {newSetting.type === 'select' && (
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Options (one per line, format: value|label)
                      </label>
                      <textarea
                        value={newSetting.options.map(opt => 
                          typeof opt === 'object' ? `${opt.value}|${opt.label}` : opt
                        ).join('\n')}
                        onChange={(e) => {
                          const options = e.target.value.split('\n')
                            .filter(line => line.trim())
                            .map(line => {
                              const parts = line.split('|');
                              if (parts.length > 1) {
                                return { value: parts[0].trim(), label: parts[1].trim() };
                              }
                              return line.trim();
                            });
                          handleNewSettingChange('options', options);
                        }}
                        rows="3"
                        className={`rounded-md w-full ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="option1|Option 1&#10;option2|Option 2"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={handleAddSetting}
                  disabled={actionStatus === 'loading'}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === 'loading' 
                      ? 'bg-primary-500 cursor-not-allowed' 
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === 'loading' ? 'Adding...' : 'Add Setting'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewSettingForm(false)}
                  disabled={actionStatus === 'loading'}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode 
                      ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delete Setting
                </h3>
                
                <div className={`mb-4 p-4 rounded-lg ${
                  darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
                }`}>
                  <p className="flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    Are you sure you want to delete this setting? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={() => handleDeleteSetting(showDeleteConfirm)}
                  disabled={actionStatus === 'loading'}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === 'loading' 
                      ? 'bg-red-500 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === 'loading' ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={actionStatus === 'loading'}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode 
                      ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Reset Settings to Defaults
                </h3>
                
                <div className={`mb-4 p-4 rounded-lg ${
                  darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
                }`}>
                  <p className="flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    Are you sure you want to reset all settings to their default values? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  disabled={actionStatus === 'loading'}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === 'loading' 
                      ? 'bg-red-500 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === 'loading' ? 'Resetting...' : 'Reset All Settings'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  disabled={actionStatus === 'loading'}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode 
                      ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminSettings;
