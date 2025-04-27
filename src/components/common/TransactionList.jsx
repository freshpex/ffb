import React, { useState } from "react";
import PropTypes from "prop-types";
import TransactionItem from "./TransactionItem";
import Button from "./Button";

const TransactionList = ({
  transactions,
  isLoading,
  error,
  title = "Transactions",
  emptyMessage = "No transactions found.",
  errorMessage = "Error loading transactions.",
  loadingMessage = "Loading transactions...",
  pagination = null,
  onLoadMore = null,
  detailFields = [],
  onRefresh = null,
  renderCustomActions = null,
  onViewDetails = null,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleViewDetails = (transaction) => {
    if (onViewDetails) {
      onViewDetails(transaction);
    } else {
      setExpandedId(expandedId === transaction._id ? null : transaction._id);
    }
  };

  if (isLoading && (!transactions || transactions.length === 0)) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="text-center py-6">
          <p className="text-red-600 dark:text-red-400 mb-3">{errorMessage}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="primary" size="sm">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isExpanded = expandedId === transaction._id;
          return (
            <div key={transaction._id} className="transition-all duration-200">
              <TransactionItem
                transaction={transaction}
                onViewDetails={handleViewDetails}
                isExpanded={isExpanded}
                detailFields={detailFields}
                showDetailButton={!onViewDetails || isExpanded}
              />

              {/* Render custom actions if provided and transaction is expanded */}
              {isExpanded && renderCustomActions && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  {renderCustomActions(transaction)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pagination && pagination.total > transactions.length && onLoadMore && (
        <div className="mt-6 text-center">
          <Button
            onClick={onLoadMore}
            variant="secondary"
            size="md"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Showing {transactions.length} of {pagination.total} transactions
          </div>
        </div>
      )}
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  loadingMessage: PropTypes.string,
  pagination: PropTypes.shape({
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
  }),
  onLoadMore: PropTypes.func,
  detailFields: PropTypes.arrayOf(PropTypes.string),
  onRefresh: PropTypes.func,
  renderCustomActions: PropTypes.func,
  onViewDetails: PropTypes.func,
};

export default TransactionList;
