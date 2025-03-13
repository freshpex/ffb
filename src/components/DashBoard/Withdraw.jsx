import { useState } from "react";
import { FaBitcoin, FaEthereum, FaUniversity, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import DashboardLayout from "./DashboardLayout";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bitcoin");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      setIsLoading(false);
      return;
    }

    if (parseFloat(amount) > 0) { // In a real app, check against actual balance
      setError("Insufficient balance");
      setIsLoading(false);
      return;
    }

    if ((withdrawalMethod === 'bitcoin' || withdrawalMethod === 'ethereum') && !walletAddress) {
      setError("Please enter a valid wallet address");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setSuccess(false);
        setAmount("");
        setWalletAddress("");
      }, 3000);
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
        Withdraw Funds
      </motion.h1>
      
      <motion.div 
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-header">
          <h2 className="card-title">Make a Withdrawal</h2>
        </div>
        
        <div className="card-body">
          {success && (
            <motion.div 
              className="alert alert-success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Your withdrawal request has been submitted successfully! Please allow 24-48 hours for processing.
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              className="alert alert-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FaExclamationCircle /> {error}
            </motion.div>
          )}

          <div className="balance-info">
            <div className="balance-box">
              <p className="balance-label">Available Balance</p>
              <h3 className="balance-amount">$0.00</h3>
            </div>
          </div>
          
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Amount (USD)</label>
              <input
                id="amount"
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                min="1"
              />
              <p className="form-hint">Minimum withdrawal: $50</p>
            </div>
            
            <div className="form-group">
              <label>Withdrawal Method</label>
              <div className="payment-options">
                <div className="payment-option">
                  <label className={`payment-method-label ${withdrawalMethod === 'bitcoin' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="withdrawalMethod"
                      value="bitcoin"
                      checked={withdrawalMethod === 'bitcoin'}
                      onChange={() => setWithdrawalMethod('bitcoin')}
                    />
                    <div className="payment-method-content">
                      <FaBitcoin size={24} />
                      <span>Bitcoin</span>
                    </div>
                  </label>
                </div>
                
                <div className="payment-option">
                  <label className={`payment-method-label ${withdrawalMethod === 'ethereum' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="withdrawalMethod"
                      value="ethereum"
                      checked={withdrawalMethod === 'ethereum'}
                      onChange={() => setWithdrawalMethod('ethereum')}
                    />
                    <div className="payment-method-content">
                      <FaEthereum size={24} />
                      <span>Ethereum</span>
                    </div>
                  </label>
                </div>
                
                <div className="payment-option">
                  <label className={`payment-method-label ${withdrawalMethod === 'bank' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="withdrawalMethod"
                      value="bank"
                      checked={withdrawalMethod === 'bank'}
                      onChange={() => setWithdrawalMethod('bank')}
                    />
                    <div className="payment-method-content">
                      <FaUniversity size={24} />
                      <span>Bank Transfer</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            {(withdrawalMethod === 'bitcoin' || withdrawalMethod === 'ethereum') && (
              <div className="form-group">
                <label htmlFor="walletAddress">
                  {withdrawalMethod === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} Wallet Address
                </label>
                <input
                  id="walletAddress"
                  type="text"
                  className="form-control"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={`Enter your ${withdrawalMethod === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} wallet address`}
                  required
                />
                <p className="form-hint">Please double-check your wallet address before submitting</p>
              </div>
            )}
            
            {withdrawalMethod === 'bank' && (
              <div className="bank-details">
                <div className="info-box">
                  <FaInfoCircle />
                  <p>To withdraw via bank transfer, please contact our support team with your bank details.</p>
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button
                type="submit"
                className="form-btn"
                disabled={isLoading || parseFloat(amount || 0) <= 0}
              >
                {isLoading ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </div>
            
            <div className="withdrawal-notes">
              <p>
                <strong>Note:</strong> Withdrawals are processed within 24-48 hours. 
                All withdrawal requests are subject to review for security purposes.
                Minimum withdrawal amount is $50.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Withdraw;
