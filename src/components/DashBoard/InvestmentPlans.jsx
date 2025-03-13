import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaShieldAlt, FaChartLine, FaUserTie } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';

const InvestmentPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  
  // Investment plans data
  const plans = [
    {
      id: 'basic',
      name: 'Basic Starter',
      price: '500',
      duration: '30 days',
      minInvestment: 500,
      maxInvestment: 4999,
      roi: '2.5% Weekly',
      referralBonus: '5%',
      features: [
        { text: 'Market Analysis', included: true },
        { text: 'Basic Portfolio Diversification', included: true },
        { text: 'Weekly Market Updates', included: true },
        { text: 'Email Support', included: true },
        { text: 'Personal Account Manager', included: false },
        { text: 'Advanced Trading Tools', included: false }
      ],
      featured: false
    },
    {
      id: 'professional',
      name: 'Professional Growth',
      price: '5,000',
      duration: '60 days',
      minInvestment: 5000,
      maxInvestment: 14999,
      roi: '3.5% Weekly',
      referralBonus: '7%',
      features: [
        { text: 'Market Analysis', included: true },
        { text: 'Advanced Portfolio Diversification', included: true },
        { text: 'Daily Market Updates', included: true },
        { text: 'Priority Email Support', included: true },
        { text: 'Personal Account Manager', included: true },
        { text: 'Advanced Trading Tools', included: false }
      ],
      featured: true
    },
    {
      id: 'expert',
      name: 'Expert Trader',
      price: '15,000+',
      duration: '90 days',
      minInvestment: 15000,
      maxInvestment: 100000,
      roi: '5% Weekly',
      referralBonus: '10%',
      features: [
        { text: 'Market Analysis', included: true },
        { text: 'Elite Portfolio Diversification', included: true },
        { text: 'Real-time Market Updates', included: true },
        { text: '24/7 VIP Support', included: true },
        { text: 'Dedicated Account Manager', included: true },
        { text: 'Premium Trading Tools', included: true }
      ],
      featured: false
    }
  ];

  const handleInvestClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the investment request
    alert(`Investment of $${investmentAmount} in ${selectedPlan.name} has been submitted for processing.`);
    setShowModal(false);
    setInvestmentAmount("");
    setSelectedPlan(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Investment Plans
      </motion.h1>

      <motion.div
        className="investment-plans"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="plans-description">
          Choose an investment plan that suits your financial goals. Our plans offer competitive returns with varying risk profiles.
        </p>

        <div className="plan-cards">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`plan-card ${plan.featured ? 'featured' : ''}`}
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                ${plan.price} <small>min / {plan.duration}</small>
              </div>

              <div className="plan-features">
                <div className="plan-roi-info">
                  <FaChartLine /> ROI: <strong>{plan.roi}</strong>
                </div>
                <div className="plan-referral-info">
                  <FaUserTie /> Referral Bonus: <strong>{plan.referralBonus}</strong>
                </div>
                
                {plan.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`plan-feature ${!feature.included ? 'disabled' : ''}`}
                  >
                    {feature.included ? <FaCheck /> : <FaTimes />}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <button 
                className="plan-cta"
                onClick={() => handleInvestClick(plan)}
              >
                Invest Now
              </button>
            </motion.div>
          ))}
        </div>

        <div className="investment-disclaimer">
          <div className="info-box">
            <FaShieldAlt />
            <div>
              <strong>Investment Notice:</strong> All investments carry risk. Please review our terms and conditions before investing. Past performance is not indicative of future results.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Investment Modal */}
      {showModal && selectedPlan && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <motion.div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>Invest in {selectedPlan.name}</h2>
            
            <div className="plan-summary">
              <div className="plan-summary-item">
                <span>Minimum Investment:</span>
                <strong>${selectedPlan.minInvestment.toLocaleString()}</strong>
              </div>
              <div className="plan-summary-item">
                <span>Maximum Investment:</span>
                <strong>${selectedPlan.maxInvestment.toLocaleString()}</strong>
              </div>
              <div className="plan-summary-item">
                <span>ROI:</span>
                <strong>{selectedPlan.roi}</strong>
              </div>
              <div className="plan-summary-item">
                <span>Duration:</span>
                <strong>{selectedPlan.duration}</strong>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="investmentAmount">Investment Amount ($)</label>
                <input
                  id="investmentAmount"
                  type="number"
                  className="form-control"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  min={selectedPlan.minInvestment}
                  max={selectedPlan.maxInvestment}
                  required
                  placeholder={`Min: $${selectedPlan.minInvestment} - Max: $${selectedPlan.maxInvestment}`}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="confirm-btn"
                  disabled={
                    !investmentAmount || 
                    parseFloat(investmentAmount) < selectedPlan.minInvestment || 
                    parseFloat(investmentAmount) > selectedPlan.maxInvestment
                  }
                >
                  Confirm Investment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InvestmentPlans;
