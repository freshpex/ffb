import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaRegClock, FaChartLine } from "react-icons/fa";
import Button from "../common/Button";

const InvestmentHistoryCard = ({ investment }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Status badge styles
  const getStatusClasses = () => {
    switch (investment.status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate daily profit
  const calculateDailyProfit = () => {
    const dailyRate = investment.roi / investment.duration;
    const dailyProfit = investment.amount * (dailyRate / 100);
    return dailyProfit;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <motion.div 
      className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">{investment.planName}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses()}`}>
            {investment.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-400">Invested</p>
            <p className="text-white font-medium">{formatCurrency(investment.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Current Profit</p>
            <p className="text-green-400 font-medium">{formatCurrency(investment.earned)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">ROI</p>
            <p className="text-white font-medium">{investment.roi}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Duration</p>
            <p className="text-white font-medium">{investment.duration} Days</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-gray-400">{investment.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ width: `${investment.progress}%` }}
            ></div>
          </div>
        </div>
        
        <button 
          className="w-full flex items-center justify-center text-gray-400 hover:text-white transition-colors pt-2 text-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Show Less <FaChevronUp className="ml-1" /></>
          ) : (
            <>Show More <FaChevronDown className="ml-1" /></>
          )}
        </button>
      </div>
      
      {/* Expanded details */}
      {expanded && (
        <motion.div 
          className="px-4 pb-4 border-t border-gray-700 mt-2 pt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-400">Start Date</p>
                <p className="text-sm text-white">{formatDate(investment.date)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-400">End Date</p>
                <p className="text-sm text-white">{formatDate(investment.endDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <FaChartLine className="text-primary-500 mr-2" />
              <p className="text-sm text-white">Earnings Breakdown</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-gray-400">Daily profit</p>
                <p className="text-white">{formatCurrency(calculateDailyProfit())}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Expected total</p>
                <p className="text-white">{formatCurrency(investment.amount * (1 + investment.roi / 100))}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              <FaRegClock className="mr-1" /> Transaction History
            </Button>
            
            {investment.status === 'Active' && (
              <Button size="sm">
                Compound Returns
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

InvestmentHistoryCard.propTypes = {
  investment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    planId: PropTypes.string.isRequired,
    planName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    roi: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    earned: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired
  }).isRequired
};

export default InvestmentHistoryCard;
