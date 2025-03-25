import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaCheckCircle, FaInfoCircle, FaArrowRight, FaStar } from "react-icons/fa";
import Button from "../common/Button";

const InvestmentPlanCard = ({ plan, onInvest, isActive = false }) => {
  // Determine color classes based on plan color
  const getColorClasses = () => {
    switch (plan.color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-400'
        };
      case 'green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-400',
          badge: 'bg-green-500/20 text-green-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          badge: 'bg-purple-500/20 text-purple-400'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-400'
        };
      default:
        return {
          bg: 'bg-primary-500/10',
          border: 'border-primary-500/30',
          text: 'text-primary-400',
          badge: 'bg-primary-500/20 text-primary-400'
        };
    }
  };

  const colors = getColorClasses();
  
  // Format price range
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const priceRange = `${formatAmount(plan.minAmount)} - ${plan.maxAmount ? formatAmount(plan.maxAmount) : '∞'}`;
  
  return (
    <motion.div 
      className={`relative rounded-xl overflow-hidden ${isActive ? 'border-2 border-primary-500' : 'border border-gray-700'} bg-gray-800 h-full flex flex-col`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
      transition={{ duration: 0.2 }}
      layout
    >
      {/* Tag if available */}
      {plan.tag && (
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors.badge} flex items-center`}>
            {plan.tag === 'Popular' && <FaStar className="mr-1" />}
            {plan.tag}
          </span>
        </div>
      )}

      {/* Recommended badge */}
      {plan.recommended && (
        <div className="absolute top-0 left-0 w-full">
          <div className="bg-primary-500 text-white text-xs font-medium py-1 px-3 text-center">
            Recommended
          </div>
        </div>
      )}

      <div className={`p-6 rounded-t-xl ${colors.bg}`}>
        <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
        <p className="text-gray-400 text-sm">{plan.description}</p>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-6">
          <span className="text-3xl font-bold text-white">{plan.roi}%</span>
          <span className="text-gray-400 ml-1">/ {plan.duration} days</span>
          <p className={`text-sm ${colors.text} mt-1`}>ROI per term</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Investment Range</p>
          <p className="text-white font-medium">{priceRange}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Risk Level</p>
          <div className="flex items-center">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors.badge}`}>
              {plan.risk}
            </span>
          </div>
        </div>
        
        <div className="mb-6 flex-1">
          <p className="text-sm text-gray-400 mb-2">Features</p>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <FaCheckCircle className={`${colors.text} mt-1 mr-2 flex-shrink-0`} />
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button
          onClick={() => onInvest(plan.id)}
          fullWidth
        >
          Invest Now <FaArrowRight className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

InvestmentPlanCard.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    minAmount: PropTypes.number.isRequired,
    maxAmount: PropTypes.number,
    roi: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    risk: PropTypes.string.isRequired,
    recommended: PropTypes.bool,
    tag: PropTypes.string,
    color: PropTypes.string
  }).isRequired,
  onInvest: PropTypes.func.isRequired,
  isActive: PropTypes.bool
};

export default InvestmentPlanCard;
