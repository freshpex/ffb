import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCards,
  selectCards,
  selectCardRequests,
  selectATMCardsStatus,
  selectATMCardsError,
} from "../../../redux/slices/atmCardsSlice";
import {
  fetchPaymentMethods,
  selectPaymentMethods,
} from "../../../redux/slices/userSlice";
import DashboardLayout from "../Layout/DashboardLayout";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Loader from "../../common/Loader";
import {
  FaPlus,
  FaCreditCard,
  FaHistory,
  FaInfoCircle,
  FaListAlt,
  FaEye,
  FaEdit,
  FaLock,
} from "react-icons/fa";
import CardsList from "./CardsList";
import CardRequestsList from "./CardRequestsList";
import NewCardModal from "./NewCardModal";
import { userService } from "../../../services/apiService";

const getExpiry = (card) => {
  if (!card?.expiryMonth || !card?.expiryYear) return "MM/YY";
  return `${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}`;
};

const SavedPaymentCard = ({ card, onView, onEdit }) => {
  const brand = card.cardBrand || "FFB";
  const cardholder = card.cardholderName || card.nickname || "Card Holder";

  return (
    <div className="space-y-3">
      <div className="relative min-h-[210px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-800 p-5 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.12),transparent_22%)]" />
        <div className="relative flex h-full min-h-[170px] flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Saved Payment Card
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{brand}</p>
            </div>
            {card.isDefault && (
              <span className="rounded-full border border-emerald-300/60 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                Default
              </span>
            )}
          </div>

          <div className="h-10 w-14 rounded-md border border-yellow-200/60 bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 shadow-inner" />

          <div>
            <p className="font-mono text-xl font-semibold tracking-[0.16em] text-white sm:text-2xl">
              **** **** **** {card.last4 || "----"}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 text-white">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  Cardholder
                </p>
                <p className="truncate text-sm font-semibold">{cardholder}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  Expires
                </p>
                <p className="text-sm font-semibold">{getExpiry(card)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onView(card)}
          className="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700"
        >
          <FaEye className="mr-2" /> View
        </button>
        <button
          type="button"
          onClick={() => onEdit(card)}
          className="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>
    </div>
  );
};

const ATMCardsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cards = useSelector(selectCards);
  const requests = useSelector(selectCardRequests);
  const status = useSelector(selectATMCardsStatus);
  const error = useSelector(selectATMCardsError);
  const paymentMethods = useSelector(selectPaymentMethods);
  const savedPaymentCards = paymentMethods.filter(
    (method) => method.type === "card",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const [showRequests, setShowRequests] = useState(false);
  const [selectedPaymentCard, setSelectedPaymentCard] = useState(null);
  const [cardPin, setCardPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  useEffect(() => {
    dispatch(fetchCards());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
      setShowAlert(true);
    }
  }, [error]);

  const handleCardRequestSuccess = () => {
    setIsModalOpen(false);
    setAlertMessage({
      type: "success",
      message:
        "Card request submitted successfully. We will process your request shortly.",
    });
    setShowAlert(true);
    dispatch(fetchCards());
  };

  const handleCardAction = (action, message) => {
    setAlertMessage({
      type: "success",
      message,
    });
    setShowAlert(true);
  };

  const toggleRequestsVisibility = () => {
    setShowRequests(!showRequests);
  };

  const openSavedCard = (card) => {
    setSelectedPaymentCard(card);
    setCardPin("");
    setPinError("");
    setIsCardRevealed(false);
  };

  const closeSavedCard = () => {
    setSelectedPaymentCard(null);
    setCardPin("");
    setPinError("");
    setIsCardRevealed(false);
    setIsVerifyingPin(false);
  };

  const revealSavedCard = async () => {
    if (!/^\d{4,6}$/.test(cardPin)) {
      setPinError("Enter your 4 to 6 digit card PIN to view details.");
      return;
    }
    setIsVerifyingPin(true);
    setPinError("");

    try {
      await userService.verifyWithdrawalPin(cardPin);
      setIsCardRevealed(true);
    } catch (err) {
      setPinError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "PIN verification failed",
      );
    } finally {
      setIsVerifyingPin(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
            Payment Cards
          </h1>

          <Button onClick={() => setIsModalOpen(true)}>
            <FaPlus className="mr-2" /> Request New Card
          </Button>
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Alert
                type={alertMessage.type}
                message={alertMessage.message}
                onDismiss={() => setShowAlert(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {status === "loading" ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {/* Card information section */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <FaCreditCard className="text-primary-400 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-white">Your Cards</h2>
              </div>

              {cards.length > 0 ? (
                <CardsList cards={cards} onCardAction={handleCardAction} />
              ) : savedPaymentCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {savedPaymentCards.map((card) => (
                    <SavedPaymentCard
                      key={card.id}
                      card={card}
                      onView={openSavedCard}
                      onEdit={() => navigate("/login/accountsettings?tab=payment")}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
                  <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FaCreditCard className="text-gray-500" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Cards Found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    You don't have any payment cards yet. Request your first
                    card to start spending.
                  </p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Request Your First Card
                  </Button>
                </div>
              )}
            </div>

            {/* Card requests section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaHistory className="text-primary-400 mr-3" size={24} />
                  <h2 className="text-xl font-semibold text-white">
                    Card Requests
                  </h2>
                </div>
                <Button
                  variant={showRequests ? "primary" : "outline"}
                  onClick={toggleRequestsVisibility}
                  className="flex items-center"
                >
                  <FaListAlt className="mr-2" />
                  {showRequests ? "Hide Requests" : "View All Requests"}
                </Button>
              </div>

              {(requests.length > 0 || showRequests) && (
                <CardRequestsList
                  requests={requests}
                  onRequestAction={handleCardAction}
                />
              )}
            </div>

            {/* Information section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-primary-400 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-white">
                  Card Information
                </h2>
              </div>

              <div className="text-gray-300 space-y-4">
                <p>
                  Our payment cards are designed to provide you with convenient
                  access to your funds while ensuring maximum security for your
                  transactions.
                </p>
                <p>
                  Virtual cards are issued instantly and can be used for online
                  purchases. Physical cards are typically delivered within 7-10
                  business days after approval.
                </p>
                <p>
                  All transactions are protected by state-of-the-art security
                  measures, and you can manage your cards directly from your
                  dashboard.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <NewCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCardRequestSuccess}
      />

      {selectedPaymentCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Card Details
                </h3>
                <p className="text-sm text-gray-400">
                  PIN is required before card details are shown.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSavedCard}
                className="rounded-md px-2 py-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                x
              </button>
            </div>

            {!isCardRevealed ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1 flex items-center text-sm font-medium text-gray-300">
                    <FaLock className="mr-2" /> Card PIN
                  </span>
                  <input
                    type="password"
                    inputMode="numeric"
                  value={cardPin}
                  onChange={(e) => setCardPin(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="Enter card PIN"
                  />
                </label>
                {pinError && <p className="text-sm text-red-400">{pinError}</p>}
                <button
                  type="button"
                  onClick={revealSavedCard}
                  disabled={isVerifyingPin}
                  className="w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
                >
                  {isVerifyingPin ? "Verifying..." : "View Details"}
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-gray-800 p-4">
                  <p className="text-gray-400">Card Number</p>
                  <p className="font-mono text-lg text-white">
                    {selectedPaymentCard.cardNumberMasked ||
                      `**** **** **** ${selectedPaymentCard.last4 || "----"}`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-800 p-4">
                    <p className="text-gray-400">Cardholder</p>
                    <p className="truncate font-semibold text-white">
                      {selectedPaymentCard.cardholderName || "Card Holder"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-4">
                    <p className="text-gray-400">Expiry</p>
                    <p className="font-semibold text-white">
                      {getExpiry(selectedPaymentCard)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Full CVV values are not stored after saving a payment card.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login/accountsettings?tab=payment")}
                  className="w-full rounded-lg border border-gray-700 px-4 py-2 font-semibold text-gray-100 hover:bg-gray-800"
                >
                  Edit Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ATMCardsPage;
