import PropTypes from "prop-types";
import {
  FaPercent,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaInfoCircle,
  FaTag,
} from "react-icons/fa";

const InvestmentPlanCard = ({ plan, userBalance, onClick }) => {
  // Check if user has enough balance to invest in this plan
  const canInvest = userBalance >= plan.minAmount;

  // Determine risk color - Added null check for riskLevel
  const getRiskColor = (planId) => {
    if (!planId) return "text-gray-400";

    switch (planId.toLowerCase()) {
      case "basic":
        return "text-green-500";
      case "standard":
        return "text-yellow-500";
      case "premium":
        return "text-orange-500";
      case "platinum":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-primary-900/20 hover:-translate-y-1 border border-gray-700 ${plan.recommended ? "ring-2 ring-primary-500" : ""}`}
    >
      {plan.recommended && (
        <div className="bg-primary-500 text-white text-xs font-bold px-3 py-1 text-center">
          RECOMMENDED
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-100">{plan.name}</h3>
          <span
            className={`text-sm font-medium ${getRiskColor(plan.riskLevel || plan.id)}`}
          >
            {(plan.riskLevel || plan.id) + " Risk"}
          </span>
        </div>

        <p className="text-gray-400 mt-2 text-sm">{plan.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <FaPercent className="mr-1" size={12} />
              <span>RETURN</span>
            </div>
            <div className="text-xl font-bold text-primary-500">
              {plan.roi ?? plan.returnRate * 100}%
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <FaCalendarAlt className="mr-1" size={12} />
              <span>DURATION</span>
            </div>
            <div className="text-xl font-bold text-gray-100">
              {plan.duration} Days
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center text-gray-400 text-xs mb-1">
            <FaMoneyBillWave className="mr-1" size={12} />
            <span>INVESTMENT AMOUNT</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-100">
              <span className="text-lg font-bold">
                ${plan.minAmount.toLocaleString()}
              </span>
              {plan.maxAmount ? (
                <span className="text-gray-400">
                  {" "}
                  - ${plan.maxAmount.toLocaleString()}
                </span>
              ) : (
                <span className="text-gray-400"> and above</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-gray-300 text-sm font-medium mb-2 flex items-center">
            <FaInfoCircle className="mr-1" size={14} />
            Features
          </h4>
          <ul className="text-gray-400 text-sm space-y-1">
            {plan.features &&
              plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <FaTag
                    className="mr-2 mt-1 text-primary-500 flex-shrink-0"
                    size={10}
                  />
                  <span>{feature}</span>
                </li>
              ))}
          </ul>
        </div>

        <button
          onClick={onClick}
          disabled={!canInvest}
          className={`mt-5 w-full py-3 rounded-lg flex items-center justify-center font-medium
            ${
              canInvest
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {canInvest ? (
            <>
              <span>Invest Now</span>
              <FaArrowRight className="ml-2" size={14} />
            </>
          ) : (
            <span>Insufficient Balance</span>
          )}
        </button>

        {!canInvest && (
          <p className="text-xs text-red-400 mt-2 text-center">
            You need at least ${plan.minAmount.toLocaleString()} to invest in
            this plan
          </p>
        )}
      </div>
    </div>
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
    features: PropTypes.arrayOf(PropTypes.string),
    riskLevel: PropTypes.string,
    recommended: PropTypes.bool,
  }).isRequired,
  userBalance: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default InvestmentPlanCard;
