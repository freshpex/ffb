import { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  FaCreditCard,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { selectCardsStatus } from "../../../redux/slices/atmCardsSlice";
import Loader from "../../common/Loader";

const CardRequestsList = ({ requests = [], onRequestAction }) => {
  const status = useSelector(selectCardsStatus);

  // Local state for tracking expanded cards
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCardExpanded = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  // Function to render status badge with appropriate color and icon
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="px-3 py-1 rounded-full bg-yellow-900/40 text-yellow-400 flex items-center text-sm">
            <FaClock className="mr-1" /> Pending
          </div>
        );
      case "approved":
        return (
          <div className="px-3 py-1 rounded-full bg-green-900/40 text-green-400 flex items-center text-sm">
            <FaCheck className="mr-1" /> Approved
          </div>
        );
      case "rejected":
        return (
          <div className="px-3 py-1 rounded-full bg-red-900/40 text-red-400 flex items-center text-sm">
            <FaTimes className="mr-1" /> Rejected
          </div>
        );
      case "cancelled":
        return (
          <div className="px-3 py-1 rounded-full bg-gray-900/40 text-gray-400 flex items-center text-sm">
            <FaTimes className="mr-1" /> Cancelled
          </div>
        );
      default:
        return (
          <div className="px-3 py-1 rounded-full bg-gray-900/40 text-gray-400 flex items-center text-sm">
            {status}
          </div>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatCardType = (type) => {
    switch (type) {
      case "virtual-debit":
        return "Virtual Debit Card";
      case "standard-debit":
        return "Standard Debit Card";
      case "premium-debit":
        return "Premium Debit Card";
      default:
        return type;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-8">
        <Loader size="md" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <FaCreditCard className="text-gray-500" size={24} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No Card Requests
        </h3>
        <p className="text-gray-400">You haven't requested any cards yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((card) => (
        <div
          key={card.id}
          className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transition-all duration-200"
        >
          <div
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700/50"
            onClick={() => toggleCardExpanded(card.id)}
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  card.type === "virtual-debit"
                    ? "bg-gray-700 text-gray-400"
                    : card.type === "standard-debit"
                      ? "bg-blue-900/40 text-blue-400"
                      : "bg-yellow-900/40 text-yellow-400"
                }`}
              >
                <FaCreditCard />
              </div>
              <div>
                <h3 className="font-medium text-white">
                  {formatCardType(card.type)}
                </h3>
                <p className="text-sm text-gray-400">
                  Requested on {formatDate(card.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {renderStatusBadge(card.status)}
            </div>
          </div>

          {expandedCard === card.id && (
            <div className="border-t border-gray-700 p-4 bg-gray-700/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Request ID</h4>
                  <p className="text-white font-mono text-sm">{card.id}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Currency</h4>
                  <p className="text-white">{card.currency || "USD"}</p>
                </div>

                {card.shippingAddress && (
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-sm text-gray-400 mb-1">
                      Shipping Address
                    </h4>
                    <p className="text-white">
                      {card.shippingAddress.street}, {card.shippingAddress.city}
                      , {card.shippingAddress.country}
                    </p>
                  </div>
                )}

                {card.status === "rejected" && card.rejectionReason && (
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-sm text-gray-400 mb-1">
                      Rejection Reason
                    </h4>
                    <p className="text-red-400">{card.rejectionReason}</p>
                  </div>
                )}

                {card.status === "pending" && (
                  <div className="col-span-1 md:col-span-2 mt-2 text-sm text-gray-400 flex items-start">
                    <FaInfoCircle className="mr-2 mt-0.5 text-primary-400" />
                    <p>
                      Your request is being reviewed. This usually takes 1-2
                      business days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

CardRequestsList.propTypes = {
  requests: PropTypes.array,
  onRequestAction: PropTypes.func,
};

export default CardRequestsList;
