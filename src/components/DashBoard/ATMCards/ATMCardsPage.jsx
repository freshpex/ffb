import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCards,
  selectCards,
  selectCardRequests,
  selectATMCardsStatus,
  selectATMCardsError,
} from "../../../redux/slices/atmCardsSlice";
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
} from "react-icons/fa";
import CardsList from "./CardsList";
import CardRequestsList from "./CardRequestsList";
import NewCardModal from "./NewCardModal";

const ATMCardsPage = () => {
  const dispatch = useDispatch();
  const cards = useSelector(selectCards);
  const requests = useSelector(selectCardRequests);
  console.log("Requests", requests);
  const status = useSelector(selectATMCardsStatus);
  const error = useSelector(selectATMCardsError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    dispatch(fetchCards());
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
    </DashboardLayout>
  );
};

export default ATMCardsPage;
