import { useState } from "react";
import { UserAuth } from "../AuthPage/AuthContext";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaShieldAlt, FaExclamationCircle, FaCheck, FaBitcoin } from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";

const AccountSettings = () => {
  const { user } = UserAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form tabs 
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }, 1500);
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Password updated successfully!");
      
      // Clear form
      e.target.reset();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }, 1500);
  };
  
  return (
    <DashboardLayout>
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Account Settings
      </motion.h1>
      
      <motion.div 
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-header">
          <h2 className="card-title">Settings</h2>
        </div>
        
        <div className="card-body" style={{ overflow: 'hidden' }}>
          {successMessage && (
            <motion.div 
              className="alert alert-success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaCheck /> {successMessage}
            </motion.div>
          )}
          
          {errorMessage && (
            <motion.div 
              className="alert alert-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationCircle /> {errorMessage}
            </motion.div>
          )}
          
          {/* Settings tabs with proper styling to prevent overlay issues */}
          <div className="settings-tabs" style={{ 
            position: 'relative', 
            zIndex: 1, 
            transform: 'translateZ(0)',
            isolation: 'isolate',
            overflow: 'visible',
            contain: 'content'
          }}>
            <button 
              className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ transform: 'translateZ(0)', position: 'relative' }}
            >
              <FaUser /> Profile
            </button>
            <button 
              className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              style={{ transform: 'translateZ(0)', position: 'relative' }}
            >
              <FaLock /> Security
            </button>
            <button 
              className={`settings-tab ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
              style={{ transform: 'translateZ(0)', position: 'relative' }}
            >
              <FaShieldAlt /> Payment Methods
            </button>
          </div>
          
          <div className="settings-content" style={{ position: 'relative', zIndex: 1 }}>
            {activeTab === 'profile' && (
              <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || 'user@example.com'}
                    disabled
                  />
                  <p className="form-hint">Email cannot be changed</p>
                </div>
                
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label>Country</label>
                  <select
                    className="form-control"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select your country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="form-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
            
            {activeTab === 'security' && (
              <form className="settings-form" onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your new password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
                
                <div className="password-requirements">
                  <h4>Password Requirements</h4>
                  <ul>
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="form-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
            
            {activeTab === 'payment' && (
              <div className="settings-form">
                <div className="form-group">
                  <label>Bitcoin Wallet Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={btcAddress}
                    onChange={(e) => setBtcAddress(e.target.value)}
                    placeholder="Enter your Bitcoin wallet address"
                  />
                </div>
                
                <div className="payment-methods">
                  <h4>Saved Payment Methods</h4>
                  <div className="payment-methods-list">
                    <div className="payment-method">
                      <div className="payment-method-icon bitcoin">
                        <FaBitcoin />
                      </div>
                      <div className="payment-method-details">
                        <h5>Bitcoin</h5>
                        <p>bc1q...8dlf</p>
                      </div>
                      <button className="payment-method-edit">Edit</button>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="form-btn"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Payment Methods'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AccountSettings;
