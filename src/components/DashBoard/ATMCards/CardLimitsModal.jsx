import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FaCog,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { updateCardLimits } from "../../../redux/slices/atmCardsSlice";
import Button from "../../common/Button";

const CardLimitsModal = ({ isOpen, onClose, card, onSuccess }) => {
  const dispatch = useDispatch();

  const [limits, setLimits] = useState({
    daily: card?.limits?.daily || 0,
    monthly: card?.limits?.monthly || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLimits((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const validateLimits = () => {
    const cardType = card.type;

    // Made up maximum limits based on card type
    const maxLimits = {
      "virtual-debit": { daily: 5000, monthly: 15000 },
      "standard-debit": { daily: 10000, monthly: 30000 },
      "premium-debit": { daily: 25000, monthly: 100000 },
    };

    if (limits.daily < 100) {
      setError("Minimum daily limit is $100");
      return false;
    }

    if (limits.monthly < 500) {
      setError("Minimum monthly limit is $500");
      return false;
    }

    if (limits.daily > maxLimits[cardType].daily) {
      setError(
        `Maximum daily limit for this card type is $${maxLimits[cardType].daily.toLocaleString()}`,
      );
      return false;
    }

    if (limits.monthly > maxLimits[cardType].monthly) {
      setError(
        `Maximum monthly limit for this card type is $${maxLimits[cardType].monthly.toLocaleString()}`,
      );
      return false;
    }

    if (limits.daily > limits.monthly) {
      setError("Daily limit cannot exceed monthly limit");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateLimits()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await dispatch(updateCardLimits(card._id, limits));

      setIsSubmitting(false);
      onSuccess("Card limits updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update card limits");
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <motion.div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-900 px-4 py-3 sm:px-6 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-white flex items-center">
              <FaCog className="mr-2 text-primary-500" />
              Manage Card Limits
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {error && (
              <div className="mb-4 bg-red-900/30 border border-red-600 text-red-500 px-4 py-3 rounded-md flex items-center">
                <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Adjust your card spending limits to control your transactions.
                These limits apply to all purchases and withdrawals made with
                this card.
              </p>

              <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-400">Card Number</div>
                  <div className="text-white font-mono">{card.cardNumber}</div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-400">Card Type</div>
                  <div className="text-white">
                    {card.type === "virtual-debit"
                      ? "Virtual Card"
                      : card.type === "standard-debit"
                        ? "Standard Card"
                        : "Premium Card"}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Current Status</div>
                  <div
                    className={`text-sm px-2 py-1 rounded-full ${
                      card.frozen
                        ? "bg-red-900/30 text-red-400 border border-red-700"
                        : "bg-green-900/30 text-green-400 border border-green-700"
                    }`}
                  >
                    {card.frozen ? "Frozen" : "Active"}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="flex justify-between">
                    <span className="block text-sm font-medium text-gray-400 mb-1">
                      Daily Limit
                    </span>
                    <span className="text-sm text-gray-500">
                      Current: ${card.limits.daily.toLocaleString()}
                    </span>
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-700 px-3 py-2 rounded-l-lg text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      name="daily"
                      value={limits.daily}
                      onChange={handleChange}
                      className="flex-grow px-3 py-2 bg-gray-700 border-y border-r border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-400 h-full"
                      style={{
                        width: `${(card.limits.dailyUsed / limits.daily) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Used: ${card.limits.dailyUsed.toLocaleString()}</span>
                    <span>
                      Available: $
                      {(limits.daily - card.limits.dailyUsed).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between">
                    <span className="block text-sm font-medium text-gray-400 mb-1">
                      Monthly Limit
                    </span>
                    <span className="text-sm text-gray-500">
                      Current: ${card.limits.monthly.toLocaleString()}
                    </span>
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-700 px-3 py-2 rounded-l-lg text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      name="monthly"
                      value={limits.monthly}
                      onChange={handleChange}
                      className="flex-grow px-3 py-2 bg-gray-700 border-y border-r border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-400 h-full"
                      style={{
                        width: `${(card.limits.monthlyUsed / limits.monthly) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      Used: ${card.limits.monthlyUsed.toLocaleString()}
                    </span>
                    <span>
                      Available: $
                      {(
                        limits.monthly - card.limits.monthlyUsed
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 p-3 rounded-lg text-sm text-blue-400 flex items-start mb-4">
                <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1">
                    Limit changes take effect immediately. If you lower your
                    limits below your current usage, new transactions may be
                    declined until usage falls below the new limit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              <FaCheck className="mr-2" /> Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-3 sm:mt-0 sm:mr-3"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

CardLimitsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  card: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default CardLimitsModal;
