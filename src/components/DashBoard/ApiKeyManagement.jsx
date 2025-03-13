import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaKey, FaEye, FaEyeSlash, FaCopy, FaTrash, FaPlusCircle, FaEdit } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState([
    { 
      id: '1', 
      name: 'Primary Trading Key', 
      key: '1A2B3C4D5E6F7G8H9I0J', 
      secret: '••••••••••••••••••••••••••••••••••••••', 
      permissions: ['read', 'spot trade'], 
      active: true,
      created: '2023-10-15T12:00:00Z' 
    },
    { 
      id: '2', 
      name: 'Data Analysis Key', 
      key: '9I8H7G6F5E4D3C2B1A0', 
      secret: '••••••••••••••••••••••••••••••••••••••', 
      permissions: ['read'], 
      active: true,
      created: '2023-11-05T09:30:00Z' 
    }
  ]);
  
  const [showSecrets, setShowSecrets] = useState({});
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKey, setNewKey] = useState({ name: '', key: '', secret: '', permissions: ['read'] });
  const [editingKey, setEditingKey] = useState(null);
  
  const toggleSecret = (id) => {
    setShowSecrets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show a toast or notification here
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  const handleDeleteKey = (id) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  };
  
  const handleToggleStatus = (id) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, active: !key.active } : key
    ));
  };
  
  const handleSaveNewKey = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to create a new key
    const newApiKey = {
      id: Date.now().toString(),
      ...newKey,
      active: true,
      created: new Date().toISOString()
    };
    
    setApiKeys([...apiKeys, newApiKey]);
    setNewKey({ name: '', key: '', secret: '', permissions: ['read'] });
    setIsAddingKey(false);
  };
  
  const handleUpdateKey = (e) => {
    e.preventDefault();
    // Update existing key
    setApiKeys(apiKeys.map(key => 
      key.id === editingKey.id ? editingKey : key
    ));
    setEditingKey(null);
  };
  
  const permissionOptions = [
    { value: 'read', label: 'Read Data' },
    { value: 'spot trade', label: 'Spot Trading' },
    { value: 'futures trade', label: 'Futures Trading' },
    { value: 'withdraw', label: 'Withdrawals' }
  ];

  return (
    <DashboardLayout>
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        API Key Management
      </motion.h1>
      
      <motion.div 
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-header">
          <h2 className="card-title">Your API Keys</h2>
          <button 
            className="view-all-btn"
            onClick={() => setIsAddingKey(true)}
          >
            <FaPlusCircle /> Add New Key
          </button>
        </div>
        
        <div className="card-body api-keys-section">
          <div className="info-box">
            <FaKey />
            <div>
              <p><strong>Important:</strong> Keep your API keys secure. Never share your API secret key. API keys give access to your account and funds.</p>
            </div>
          </div>
          
          {apiKeys.length === 0 ? (
            <div className="empty-state">
              <FaKey className="empty-state-icon" />
              <h3>No API Keys</h3>
              <p>You haven`t created any API keys yet</p>
              <button 
                className="form-btn" 
                onClick={() => setIsAddingKey(true)}
              >
                Create Your First API Key
              </button>
            </div>
          ) : (
            apiKeys.map(apiKey => (
              <div className="api-key-card" key={apiKey.id}>
                <div className="api-key-header">
                  <h3 className="api-key-name">{apiKey.name}</h3>
                  <div className={`api-key-status ${apiKey.active ? 'active' : 'inactive'}`}>
                    {apiKey.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="api-key-info">
                  <div className="api-key-field">
                    <div className="api-key-label">API Key</div>
                    <div className="api-key-value">
                      {apiKey.key}
                      <button 
                        className="copy-btn" 
                        onClick={() => copyToClipboard(apiKey.key)}
                        title="Copy to clipboard"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  
                  <div className="api-key-field">
                    <div className="api-key-label">Secret Key</div>
                    <div className="api-key-value api-key-secret">
                      {showSecrets[apiKey.id] ? apiKey.secret : '••••••••••••••••••••••••••••••••••••••'}
                      <button 
                        className="copy-btn" 
                        onClick={() => showSecrets[apiKey.id] && copyToClipboard(apiKey.secret)}
                        title={showSecrets[apiKey.id] ? "Copy to clipboard" : "Show secret first"}
                        disabled={!showSecrets[apiKey.id]}
                      >
                        <FaCopy />
                      </button>
                      <button 
                        className="toggle-secret-btn" 
                        onClick={() => toggleSecret(apiKey.id)}
                        title={showSecrets[apiKey.id] ? "Hide secret" : "Show secret"}
                      >
                        {showSecrets[apiKey.id] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="api-key-field">
                    <div className="api-key-label">Permissions</div>
                    <div className="api-key-value">
                      {apiKey.permissions.join(', ')}
                    </div>
                  </div>
                  
                  <div className="api-key-field">
                    <div className="api-key-label">Created</div>
                    <div className="api-key-value">
                      {new Date(apiKey.created).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="api-key-actions">
                  <button 
                    className="api-key-btn secondary"
                    onClick={() => setEditingKey({...apiKey})}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="api-key-btn secondary"
                    onClick={() => handleToggleStatus(apiKey.id)}
                  >
                    {apiKey.active ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    className="api-key-btn danger"
                    onClick={() => handleDeleteKey(apiKey.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
          
          {/* Add New Key Modal */}
          {isAddingKey && (
            <div className="modal-backdrop">
              <motion.div 
                className="modal-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Create New API Key</h2>
                <form onSubmit={handleSaveNewKey}>
                  <div className="form-group">
                    <label>Key Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newKey.name}
                      onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                      placeholder="e.g., Trading Bot, Data Analysis"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>API Key</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newKey.key}
                      onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                      placeholder="Enter your Binance API key"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>API Secret</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newKey.secret}
                      onChange={(e) => setNewKey({...newKey, secret: e.target.value})}
                      placeholder="Enter your Binance API secret"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Permissions</label>
                    <div className="checkbox-group">
                      {permissionOptions.map(option => (
                        <label key={option.value} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={newKey.permissions.includes(option.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewKey({
                                  ...newKey,
                                  permissions: [...newKey.permissions, option.value]
                                });
                              } else {
                                setNewKey({
                                  ...newKey,
                                  permissions: newKey.permissions.filter(p => p !== option.value)
                                });
                              }
                            }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setIsAddingKey(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-btn"
                    >
                      Save API Key
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
          
          {/* Edit Key Modal */}
          {editingKey && (
            <div className="modal-backdrop" onClick={() => setEditingKey(null)}>
              <motion.div 
                className="modal-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Edit API Key</h2>
                <form onSubmit={handleUpdateKey}>
                  <div className="form-group">
                    <label>Key Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingKey.name}
                      onChange={(e) => setEditingKey({...editingKey, name: e.target.value})}
                      placeholder="e.g., Trading Bot, Data Analysis"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Permissions</label>
                    <div className="checkbox-group">
                      {permissionOptions.map(option => (
                        <label key={option.value} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editingKey.permissions.includes(option.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingKey({
                                  ...editingKey,
                                  permissions: [...editingKey.permissions, option.value]
                                });
                              } else {
                                setEditingKey({
                                  ...editingKey,
                                  permissions: editingKey.permissions.filter(p => p !== option.value)
                                });
                              }
                            }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setEditingKey(null)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-btn"
                    >
                      Update API Key
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ApiKeyManagement;
