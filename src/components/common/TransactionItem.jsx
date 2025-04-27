import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  FaArrowRight,
  FaArrowDown,
  FaArrowUp,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const getTransactionIcon = (type) => {
  switch (type) {
    case "deposit":
      return <FaArrowDown className="text-green-400" />;
    case "withdrawal":
      return <FaArrowUp className="text-red-400" />;
    default:
      return <FaArrowRight className="text-blue-400" />;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Pending
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Completed
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Failed
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {status}
        </span>
      );
  }
};

const TransactionItem = ({
  transaction,
  onViewDetails,
  showDetailButton = true,
  isExpanded = false,
  detailFields = [],
}) => {
  const {
    _id,
    type,
    amount,
    currency,
    status,
    createdAt,
    description,
    method,
    reference,
    metadata = {},
  } = transaction;

  return (
    <div className="mb-3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Main transaction info */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {getTransactionIcon(type)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {type === "deposit"
                  ? "Deposit"
                  : type === "withdrawal"
                    ? "Withdrawal"
                    : type}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {method}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold ${type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {type === "deposit" ? "+" : "-"}
              {amount} {currency}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(createdAt), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div>{getStatusBadge(status)}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {reference}
          </div>
        </div>
      </div>

      {/* Expandable details */}
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm">
            <p className="mb-1">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Description:{" "}
              </span>
              <span className="text-gray-900 dark:text-gray-300">
                {description}
              </span>
            </p>

            {/* Time stamps */}
            <p className="mb-1">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Created:{" "}
              </span>
              <span className="text-gray-900 dark:text-gray-300">
                {format(new Date(createdAt), "MMM dd, yyyy HH:mm:ss")}
              </span>
            </p>

            {/* Dynamic detail fields */}
            {detailFields.map((field) => {
              if (field === "metadata" && metadata) {
                return Object.entries(metadata).map(([key, value]) => (
                  <p key={key} className="mb-1">
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>
                    <span className="text-gray-900 dark:text-gray-300">
                      {" "}
                      {value}
                    </span>
                  </p>
                ));
              } else if (transaction[field]) {
                return (
                  <p key={field} className="mb-1">
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </span>
                    <span className="text-gray-900 dark:text-gray-300">
                      {" "}
                      {transaction[field]}
                    </span>
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {showDetailButton && !isExpanded && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onViewDetails(transaction)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string,
    method: PropTypes.string,
    reference: PropTypes.string,
    metadata: PropTypes.object,
  }).isRequired,
  onViewDetails: PropTypes.func,
  showDetailButton: PropTypes.bool,
  isExpanded: PropTypes.bool,
  detailFields: PropTypes.arrayOf(PropTypes.string),
};

export default TransactionItem;
