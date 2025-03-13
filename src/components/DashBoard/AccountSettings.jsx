import { useState, useEffect } from "react";
import { UserAuth } from "../AuthPage/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUser, FaEnvelope, FaLock, FaGlobe, FaPhone, 
  FaBitcoin, FaExchangeAlt, FaShieldAlt, FaSave
} from "react-icons/fa";
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
    setSuccessMessage("");
    setErrorMessage("");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 1500);
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setErrorMessage("Password change functionality is not implemented yet.");
    
    // Clear error message after 3 seconds
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="content-wrapper">
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
            <div className="settings-tabs">
              <button 
                className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} 
                onClick={() => setActiveTab('profile')}
              >
                <FaUser /> Profile
              </button>
              <button 
                className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FaShieldAlt /> Security
              </button>
              <button 
                className={`settings-tab ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveTab('payment')}
              >
                <FaExchangeAlt /> Payment Methods
              </button>
            </div>
          </div>
          
          <div className="card-body">
            {successMessage && (
              <motion.div 
                className="alert alert-success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {successMessage}
              </motion.div>
            )}
            
            {errorMessage && (
              <motion.div 
                className="alert alert-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errorMessage}
              </motion.div>
            )}
            
            {activeTab === 'profile' && (
              <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaUser /> First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <FaUser /> Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>
                    <FaEnvelope /> Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ""}
                    disabled
                    readOnly
                  />
                  <p className="form-hint">Email address cannot be changed</p>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <FaGlobe /> Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="form-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
            
            {activeTab === 'security' && (
              <form className="settings-form" onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>
                    <FaLock /> Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaLock /> New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <FaLock /> Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <div className="password-requirements">
                  <h4>Password must:</h4>
                  <ul>
                    <li>Be at least 8 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="form-btn"
                  >
                    <FaSave /> Change Password
                  </button>
                </div>
              </form>
            )}
            
            {activeTab === 'payment' && (
              <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    <FaBitcoin /> Bitcoin Wallet Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={btcAddress}
                    onChange={(e) => setBtcAddress(e.target.value)}
                    placeholder="Enter your Bitcoin wallet address"
                  />
                  <p className="form-hint">This wallet will be used for withdrawals</p>
                </div>
                
                <div className="payment-methods">
                  <h4>Supported Payment Methods</h4>
                  <div className="payment-methods-list">
                    <div className="payment-method">
                      <div className="payment-method-icon bitcoin"></div>
                      <span>Bitcoin (BTC)</span>
                    </div>
                    <div className="payment-method">
                      <div className="payment-method-icon ethereum"></div>
                      <span>Ethereum (ETH)</span>
                    </div>
                    <div className="payment-method">
                      <div className="payment-method-icon litecoin"></div>
                      <span>Litecoin (LTC)</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="form-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
