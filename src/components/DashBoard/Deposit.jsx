import { useState } from "react";
import { FaBitcoin, FaEthereum, FaCreditCard, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import DashboardLayout from "./DashboardLayout";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bitcoin");
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setSuccess(false);
        setAmount("");
      }, 3000);
    }, 1500);
  };

  const getPaymentMethodIcon = () => {
    switch(paymentMethod) {
      case "bitcoin":
        return <FaBitcoin size={30} />;
      case "ethereum":
        return <FaEthereum size={30} />;
      case "card":
        return <FaCreditCard size={30} />;
      default:
        return <FaBitcoin size={30} />;
    }
  };

  return (
    <DashboardLayout>
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Deposit Funds
      </motion.h1>
      
      <motion.div 
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-header">
          <h2 className="card-title">Make a Deposit</h2>
        </div>
        
        <div className="card-body">
          {success && (
            <motion.div 
              className="alert alert-success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Your deposit request has been submitted successfully!
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
              <p className="form-hint">Minimum deposit: $100</p>
            </div>
            
            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-options">
                <div className="payment-option">
                  <label className={`payment-method-label ${paymentMethod === 'bitcoin' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bitcoin"
                      checked={paymentMethod === 'bitcoin'}
                      onChange={() => setPaymentMethod('bitcoin')}
                    />
                    <div className="payment-method-content">
                      <FaBitcoin size={24} />
                      <span>Bitcoin</span>
                    </div>
                  </label>
                </div>
                
                <div className="payment-option">
                  <label className={`payment-method-label ${paymentMethod === 'ethereum' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ethereum"
                      checked={paymentMethod === 'ethereum'}
                      onChange={() => setPaymentMethod('ethereum')}
                    />
                    <div className="payment-method-content">
                      <FaEthereum size={24} />
                      <span>Ethereum</span>
                    </div>
                  </label>
                </div>
                
                <div className="payment-option">
                  <label className={`payment-method-label ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="payment-method-content">
                      <FaCreditCard size={24} />
                      <span>Credit Card</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="payment-details">
              <div className="payment-method-header">
                {getPaymentMethodIcon()}
                <h3>
                  {paymentMethod === 'bitcoin' && 'Bitcoin Payment Details'}
                  {paymentMethod === 'ethereum' && 'Ethereum Payment Details'}
                  {paymentMethod === 'card' && 'Credit Card Details'}
                </h3>
              </div>
              
              {paymentMethod === 'bitcoin' && (
                <div className="crypto-address">
                  <p className="address-label">Send Bitcoin to this address:</p>
                  <div className="address-box">
                    <code>bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
                    <button type="button" className="copy-btn">Copy</button>
                  </div>
                  <div className="qr-code">
                    <div className="qr-placeholder"></div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'ethereum' && (
                <div className="crypto-address">
                  <p className="address-label">Send Ethereum to this address:</p>
                  <div className="address-box">
                    <code>0x71C7656EC7ab88b098defB751B7401B5f6d8976F</code>
                    <button type="button" className="copy-btn">Copy</button>
                  </div>
                  <div className="qr-code">
                    <div className="qr-placeholder"></div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" className="form-control" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiration Date</label>
                      <input type="text" className="form-control" placeholder="MM/YY" />
                    </div>
                    
                    <div className="form-group">
                      <label>CVC</label>
                      <input type="text" className="form-control" placeholder="CVC" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="form-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Submit Deposit'}
              </button>
            </div>
            
            <div className="deposit-notes">
              <p>
                <strong>Note:</strong> Once your deposit is confirmed, it will be added to your account balance.
                Processing time depends on the payment method selected.
                For cryptocurrency payments, please allow for blockchain confirmations (typically 1-6 confirmations).
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Deposit;
