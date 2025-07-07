import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaEllipsisH,
  FaLock,
  FaUnlock,
  FaTimes,
  FaCog,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import {
  freezeCard,
  unfreezeCard,
  cancelCardRequest,
} from "../../../redux/slices/atmCardsSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";
import CardLimitsModal from "./CardLimitsModal";

// Card types mapped to background gradients
const cardDesigns = {
  "virtual-debit": "bg-gradient-to-r from-gray-700 to-gray-900",
  "standard-debit": "bg-gradient-to-r from-blue-600 to-indigo-800",
  "premium-debit": "bg-gradient-to-r from-yellow-500 to-purple-800",
};

const getCardTypeName = (type) => {
  switch (type) {
    case "virtual-debit":
      return "Virtual Card";
    case "standard-debit":
      return "Standard Card";
    case "premium-debit":
      return "Premium Card";
    default:
      return "Credit Card";
  }
};

const CardsList = ({ cards, onCardAction }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCardNumber, setShowCardNumber] = useState({});
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [limitsModalOpen, setLimitsModalOpen] = useState(null);

  const toggleShowCardNumber = (cardId) => {
    setShowCardNumber((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const toggleActionMenu = (cardId) => {
    setActionMenuOpen(actionMenuOpen === cardId ? null : cardId);
  };

  const handleFreezeCard = async (cardId) => {
    await dispatch(freezeCard(cardId));
    setActionMenuOpen(null);
    onCardAction(
      "freeze",
      "Card frozen successfully. You can unfreeze it anytime.",
    );
  };

  const handleUnfreezeCard = async (cardId) => {
    await dispatch(unfreezeCard(cardId));
    setActionMenuOpen(null);
    onCardAction(
      "unfreeze",
      "Card unfrozen successfully. You can now use your card again.",
    );
  };

  const handleCancelCard = async (cardId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this card? This action cannot be undone.",
      )
    ) {
      await dispatch(cancelCardRequest(cardId));
      setActionMenuOpen(null);
      onCardAction("cancel", "Card canceled successfully.");
    }
  };

  const handleViewDetails = (cardId) => {
    navigate(`/login/cards/${cardId}`);
  };

  const handleManageLimits = (cardId) => {
    setLimitsModalOpen(cardId);
    setActionMenuOpen(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
        >
          {/* Card Display */}
          <div
            className={`${cardDesigns[card.type]} p-6 relative overflow-hidden h-48`}
          >
            {/* Card Status Badge */}
            {card.frozen && (
              <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium border border-gray-600">
                <FaLock className="inline mr-1" size={10} /> Frozen
              </div>
            )}

            {/* Card Issuer & Type */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold text-lg">
                  Fidelity First Bank
                </h3>
                <p className="text-gray-300 text-xs">
                  {getCardTypeName(card.type)}
                </p>
              </div>
              <FaCreditCard className="text-white/50" size={24} />
            </div>

            {/* Card Number */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-300 text-xs mb-1">Card Number</p>
                <button
                  onClick={() => toggleShowCardNumber(card.id)}
                  className="text-white/70 hover:text-white"
                >
                  {showCardNumber[card.id] ? (
                    <FaEyeSlash size={14} />
                  ) : (
                    <FaEye size={14} />
                  )}
                </button>
              </div>
              <p className="text-white font-mono font-medium text-lg tracking-wider">
                {showCardNumber[card.id]
                  ? card.cardNumber.replace(/\*{4}/g, "5678")
                  : card.cardNumber}
              </p>
            </div>

            {/* Card Holder & Expiry */}
            <div className="mt-4 flex justify-between items-end">
              <div>
                <p className="text-gray-300 text-xs mb-1">Card Holder</p>
                <p className="text-white font-medium">{card.name}</p>
              </div>
              <div>
                <p className="text-gray-300 text-xs mb-1">Expires</p>
                <p className="text-white font-medium">{card.expiryDate}</p>
              </div>
            </div>
          </div>

          {/* Card Details & Actions */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-400 text-xs">Card Balance</p>
                <p className="text-white text-lg font-semibold">
                  $
                  {card.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                  onClick={() => toggleActionMenu(card.id)}
                >
                  <FaEllipsisH />
                </button>

                {actionMenuOpen === card.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10"
                  >
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                        onClick={() => handleViewDetails(card.id)}
                      >
                        <FaArrowRight className="mr-3 text-gray-400" />
                        View Details
                      </button>

                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                        onClick={() => handleManageLimits(card.id)}
                      >
                        <FaCog className="mr-3 text-gray-400" />
                        Manage Limits
                      </button>

                      {card.frozen ? (
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-green-400 hover:bg-gray-600"
                          onClick={() => handleUnfreezeCard(card.id)}
                        >
                          <FaUnlock className="mr-3" />
                          Unfreeze Card
                        </button>
                      ) : (
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-yellow-400 hover:bg-gray-600"
                          onClick={() => handleFreezeCard(card.id)}
                        >
                          <FaLock className="mr-3" />
                          Freeze Card
                        </button>
                      )}

                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                        onClick={() => handleCancelCard(card.id)}
                      >
                        <FaTimes className="mr-3" />
                        Cancel Card
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Daily Limit</p>
                <p className="text-white font-medium">
                  ${card.limits.daily.toLocaleString()}
                </p>
                <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-400 h-full"
                    style={{
                      width: `${(card.limits.dailyUsed / card.limits.daily) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Monthly Limit</p>
                <p className="text-white font-medium">
                  ${card.limits.monthly.toLocaleString()}
                </p>
                <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-400 h-full"
                    style={{
                      width: `${(card.limits.monthlyUsed / card.limits.monthly) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(card.id)}
              >
                View Transactions
              </Button>

              {card.frozen ? (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleUnfreezeCard(card.id)}
                >
                  <FaUnlock className="mr-1" /> Unfreeze
                </Button>
              ) : (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleFreezeCard(card.id)}
                >
                  <FaLock className="mr-1" /> Freeze
                </Button>
              )}
            </div>
          </div>

          {/* Card Limits Modal */}
          <CardLimitsModal
            isOpen={limitsModalOpen === card.id}
            onClose={() => setLimitsModalOpen(null)}
            card={card}
            onSuccess={(message) => {
              setLimitsModalOpen(null);
              onCardAction("limits", message);
            }}
          />
        </div>
      ))}
    </div>
  );
};

CardsList.propTypes = {
  cards: PropTypes.array.isRequired,
  onCardAction: PropTypes.func.isRequired,
};

export default CardsList;
