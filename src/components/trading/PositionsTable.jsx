import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  FaChevronUp,
  FaChevronDown,
  FaEllipsisV,
  FaSpinner,
} from "react-icons/fa";
import {
  fetchOrders,
  fetchPortfolio,
  fetchTradingHistory,
  selectOpenOrders,
  selectOrderHistory,
  selectPositions,
  selectTradingStatus,
} from "../../redux/slices/tradingSlice";

/**
 * Reusable component for displaying user positions/holdings
 */
const PositionsTable = ({
  variant = "standard", // 'standard', 'compact', 'advanced'
  showHeader = true,
  showActions = true,
  maxItems = null,
  className = "",
  onPositionClick = () => {},
}) => {
  const dispatch = useDispatch();
  const positions = useSelector(selectPositions);
  const openOrders = useSelector(selectOpenOrders) || [];
  const orderHistory = useSelector(selectOrderHistory) || [];
  const status = useSelector(selectTradingStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Load positions on mount
  useEffect(() => {
    if (status.portfolio !== "loading") {
      dispatch(fetchPortfolio());
      dispatch(fetchOrders({ status: ["new", "partially_filled"] }));
      dispatch(fetchTradingHistory({}));
    }
  }, [dispatch, status.portfolio]);

  // Format price with correct precision based on value
  const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice)) return "0.00";
    const absolutePrice = Math.abs(numericPrice);

    if (absolutePrice >= 1000) {
      return numericPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else if (absolutePrice >= 1) {
      return numericPrice.toFixed(2);
    } else if (absolutePrice >= 0.01) {
      return numericPrice.toFixed(4);
    } else {
      return numericPrice.toFixed(8);
    }
  };

  // Format percentage value
  const formatPercentage = (percentage) => {
    const numericPercentage = Number(percentage);
    if (!Number.isFinite(numericPercentage)) return "0.00%";
    return `${numericPercentage >= 0 ? "+" : ""}${numericPercentage.toFixed(2)}%`;
  };

  const normalizePosition = (position) => ({
    ...position,
    amount: position.amount ?? position.quantity ?? 0,
    avgPrice: position.avgPrice ?? position.averagePrice ?? 0,
    pnl: position.pnl ?? position.profitLoss ?? 0,
    pnlPercentage: position.pnlPercentage ?? position.profitLossPercentage ?? 0,
    value: position.value ?? position.totalValue ?? 0,
  });

  const isForexOrder = (order) =>
    order?.market === "forex" ||
    order?.closePrice !== undefined ||
    order?.openPrice !== undefined ||
    order?.profit !== undefined ||
    order?.accountLabel;

  const firstNumber = (...values) => {
    for (const value of values) {
      if (value === null || value === undefined || value === "") continue;
      const number = Number(value);
      if (Number.isFinite(number)) return number;
    }
    return 0;
  };

  const formatMoney = (value) => firstNumber(value).toFixed(2);

  const valueClass = (value, fallback = "") =>
    firstNumber(value) < 0 ? "text-red-500" : fallback;

  const formatForexDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  };

  const combinedTradeRows = [...openOrders, ...orderHistory];
  const seenTradeIds = new Set();
  const uniqueTradeRows = combinedTradeRows.filter((order) => {
    const id = order?._id || order?.id || `${order?.symbol}-${order?.createdAt}`;
    if (seenTradeIds.has(id)) return false;
    seenTradeIds.add(id);
    return true;
  });
  const forexOrders = uniqueTradeRows.filter(isForexOrder);
  const forexSummary = [...forexOrders].reverse().find(
    (order) =>
      order.deposit !== undefined ||
      order.balance !== undefined ||
      order.swap !== undefined ||
      order.commission !== undefined,
  );
  const forexProfit = forexOrders.reduce(
    (sum, order) => sum + firstNumber(order.profit),
    0,
  );
  const forexDeposit = firstNumber(forexSummary?.deposit);
  const forexSwap = firstNumber(forexSummary?.swap);
  const forexCommission = firstNumber(forexSummary?.commission);
  const forexBalance =
    forexDeposit + forexProfit + forexSwap + forexCommission;

  const ForexPositions = () => (
    <div className="bg-black p-2 text-white">
      {forexSummary && (
        <div className="mb-2">
          <div className="flex justify-between text-base">
            <span>Balance</span>
            <span className={valueClass(forexDeposit, "text-blue-500")}>
              {formatMoney(forexDeposit)}
            </span>
          </div>
          <div className="flex justify-between gap-3 text-sm text-gray-400">
            <span className="truncate">{forexSummary.accountLabel || "Forex account"}</span>
            <span className="shrink-0">
              {formatForexDate(forexSummary.date || forexSummary.createdAt)}
            </span>
          </div>
        </div>
      )}

      {forexOrders.map((order) => {
        const side = (order.side || "buy").toLowerCase();
        const isBuy = side === "buy";
        const openPrice = firstNumber(order.openPrice, order.executionPrice, order.price);
        const closePrice = firstNumber(order.closePrice, order.currentPrice);
        const profit = firstNumber(order.profit, order.total);

        return (
          <button
            type="button"
            key={order.id || order._id}
            className={`block w-full py-1.5 pl-2 text-left ${
              !isBuy ? "border-l-4 border-red-500" : ""
            }`}
            onClick={() => onPositionClick(order)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">
                  {order.symbol}
                  <span className={isBuy ? "text-blue-500" : "text-red-500"}>
                    {" "}
                    {side} {formatPrice(firstNumber(order.amount, order.quantity))}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {formatPrice(openPrice)}
                  {closePrice ? ` -> ${formatPrice(closePrice)}` : ""}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className={`text-sm font-semibold ${valueClass(profit, "text-blue-500")}`}>
                  {formatMoney(profit)}
                </div>
                <div className="text-xs text-gray-400">
                  {formatForexDate(order.date || order.processedAt || order.createdAt)}
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {forexSummary && (
        <div className="space-y-0.5 pt-2 text-base">
          <div className="flex justify-between"><span>Deposit</span><span className={valueClass(forexDeposit)}>{formatMoney(forexDeposit)}</span></div>
          <div className="flex justify-between"><span>Profit</span><span className={valueClass(forexProfit)}>{formatMoney(forexProfit)}</span></div>
          <div className="flex justify-between"><span>Swap</span><span className={valueClass(forexSwap)}>{formatMoney(forexSwap)}</span></div>
          <div className="flex justify-between"><span>Commission</span><span className={valueClass(forexCommission)}>{formatMoney(forexCommission)}</span></div>
          <div className="flex justify-between"><span>Balance</span><span className={valueClass(forexBalance)}>{formatMoney(forexBalance)}</span></div>
        </div>
      )}
    </div>
  );

  // Get positions to display (apply maxItems limit if set)
  const normalizedPositions = (positions || []).map(normalizePosition);
  const tradePositions = uniqueTradeRows
    .filter((order) => !isForexOrder(order))
    .filter((order) =>
      ["new", "partially_filled", "filled"].includes(order?.status),
    )
    .map((order) => {
      const amount = firstNumber(order.amount, order.quantity, order.executedQuantity);
      const avgPrice = firstNumber(order.executionPrice, order.price, order.openPrice);
      const value = firstNumber(order.total, amount * avgPrice);
      return {
        symbol: order.symbol,
        amount,
        avgPrice,
        currentPrice: firstNumber(order.currentPrice, avgPrice),
        value,
        pnl: firstNumber(order.profit, order.profitLoss),
        pnlPercentage: firstNumber(order.profitLossPercentage),
        source: "admin-trade",
        status: order.status,
        _order: order,
      };
    })
    .filter((position) => position.symbol && position.amount > 0);

  const mergedPositionsByKey = new Map();
  for (const position of normalizedPositions) {
    mergedPositionsByKey.set(`portfolio:${position.symbol}`, position);
  }
  for (const position of tradePositions) {
    const alreadyInPortfolio = normalizedPositions.some(
      (portfolioPosition) => portfolioPosition.symbol === position.symbol,
    );
    if (!alreadyInPortfolio || position.status !== "filled") {
      mergedPositionsByKey.set(
        `${position.source}:${position.symbol}:${position.status}`,
        position,
      );
    }
  }
  const mergedPositions = Array.from(mergedPositionsByKey.values());
  const displayPositions = maxItems
    ? mergedPositions.slice(0, maxItems)
    : mergedPositions;

  // Apply pagination
  const totalPages = Math.ceil(displayPositions.length / itemsPerPage);
  const paginatedPositions = displayPositions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Check if positions are loading
  const isLoading = status.portfolio === "loading";

  // Handle empty state
  if (!isLoading && displayPositions.length === 0 && forexOrders.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        {showHeader && (
          <h3 className="text-sm font-medium text-white mb-4">Positions</h3>
        )}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="text-gray-400 mb-2">No positions found</div>
          <div className="text-sm text-gray-500 max-w-md">
            When you buy assets, your positions will appear here. Start trading
            to build your portfolio.
          </div>
        </div>
      </div>
    );
  }

  // Pagination controls
  const Pagination = () => (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <button
        className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        Previous
      </button>
      <span className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      >
        Next
      </button>
    </div>
  );

  // Compact variant (for dashboards, sidebars)
  if (variant === "compact") {
    return (
      <div className={`bg-gray-800 rounded-lg ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Positions</h3>
            {isLoading && (
              <FaSpinner className="animate-spin text-gray-400" size={14} />
            )}
          </div>
        )}

        {isLoading && displayPositions.length === 0 ? (
          <div className="p-4 text-center">
            <FaSpinner
              className="animate-spin text-gray-400 mx-auto"
              size={20}
            />
            <p className="text-sm text-gray-400 mt-2">Loading positions...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {forexOrders.length > 0 && <ForexPositions />}
            {paginatedPositions.map((position) => (
              <div
                key={position.symbol}
                className="p-3 hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => onPositionClick(position)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-white">
                    {position.symbol}
                  </span>
                  <span
                    className={
                      position.pnlPercentage >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {formatPercentage(position.pnlPercentage)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className={valueClass(position.amount, "text-gray-400")}>
                    {formatPrice(position.amount)} {position.symbol}
                  </div>
                  <div className={`text-right ${valueClass(position.value, "text-gray-300")}`}>
                    ${formatPrice(position.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Loading state
  if (isLoading && displayPositions.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Positions</h3>
            <FaSpinner className="animate-spin text-gray-400" size={14} />
          </div>
        )}
        <div className="p-6 text-center">
          <FaSpinner className="animate-spin text-gray-400 mx-auto" size={24} />
          <p className="text-sm text-gray-400 mt-3">Loading positions...</p>
        </div>
      </div>
    );
  }

  // Standard variant (responsive)
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">Positions</h3>
          {isLoading && (
            <FaSpinner className="animate-spin text-gray-400" size={14} />
          )}
        </div>
      )}

      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto">
        {forexOrders.length > 0 && <ForexPositions />}
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Avg. Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                PnL
              </th>
              {showActions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedPositions.map((position) => (
              <tr
                key={position.symbol}
                className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => onPositionClick(position)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <div className="text-sm font-medium text-white">
                        {position.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${valueClass(position.amount, "text-gray-300")}`}>
                  {formatPrice(position.amount)}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${valueClass(position.avgPrice, "text-gray-300")}`}>
                  ${formatPrice(position.avgPrice)}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${valueClass(position.currentPrice, "text-gray-300")}`}>
                  ${formatPrice(position.currentPrice)}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${valueClass(position.value, "text-white")}`}>
                  ${formatPrice(position.value)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  <div className="flex flex-col items-end">
                    <span
                      className={
                        position.pnl >= 0 ? "text-green-400" : "text-red-400"
                      }
                    >
                      ${formatPrice(Math.abs(position.pnl))}
                    </span>
                    <span
                      className={`text-xs ${position.pnlPercentage >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {position.pnlPercentage >= 0 ? (
                        <FaChevronUp className="inline mr-1" size={8} />
                      ) : (
                        <FaChevronDown className="inline mr-1" size={8} />
                      )}
                      {formatPercentage(position.pnlPercentage)}
                    </span>
                  </div>
                </td>
                {showActions && (
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPositionClick(position, "menu");
                      }}
                      className="text-gray-400 hover:text-white p-1 focus:outline-none"
                    >
                      <FaEllipsisV size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination />
      </div>

      {/* Mobile view - Card layout */}
      <div className="md:hidden divide-y divide-gray-700">
        {forexOrders.length > 0 && <ForexPositions />}
        {paginatedPositions.map((position) => (
          <div
            key={position.symbol}
            className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
            onClick={() => onPositionClick(position)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-white text-base">
                {position.symbol}
              </span>
              {showActions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPositionClick(position, "menu");
                  }}
                  className="text-gray-400 hover:text-white p-1 focus:outline-none"
                >
                  <FaEllipsisV size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="text-gray-400">Amount</div>
              <div className={`text-right ${valueClass(position.amount, "text-gray-300")}`}>
                {formatPrice(position.amount)}
              </div>

              <div className="text-gray-400">Avg Price</div>
              <div className={`text-right ${valueClass(position.avgPrice, "text-gray-300")}`}>
                ${formatPrice(position.avgPrice)}
              </div>

              <div className="text-gray-400">Current Price</div>
              <div className={`text-right ${valueClass(position.currentPrice, "text-gray-300")}`}>
                ${formatPrice(position.currentPrice)}
              </div>

              <div className="text-gray-400">Value</div>
              <div className={`text-right font-medium ${valueClass(position.value, "text-white")}`}>
                ${formatPrice(position.value)}
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-gray-700/50">
              <div className="text-gray-400 text-sm">P&L</div>
              <div className="flex flex-col items-end">
                <span
                  className={
                    position.pnl >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  ${formatPrice(Math.abs(position.pnl))}
                </span>
                <span
                  className={`text-xs ${position.pnlPercentage >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {position.pnlPercentage >= 0 ? (
                    <FaChevronUp className="inline mr-1" size={8} />
                  ) : (
                    <FaChevronDown className="inline mr-1" size={8} />
                  )}
                  {formatPercentage(position.pnlPercentage)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

PositionsTable.propTypes = {
  variant: PropTypes.oneOf(["standard", "compact", "advanced"]),
  showHeader: PropTypes.bool,
  showActions: PropTypes.bool,
  maxItems: PropTypes.number,
  className: PropTypes.string,
  onPositionClick: PropTypes.func,
};

export default PositionsTable;
