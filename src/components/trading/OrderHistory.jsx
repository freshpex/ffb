import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { FaSearch, FaSpinner } from "react-icons/fa";
import {
  fetchOrders,
  fetchTradingHistory,
  selectOpenOrders,
  selectOrderHistory,
  selectTradingStatus,
} from "../../redux/slices/tradingSlice";

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const firstNumber = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return 0;
};

const isForexOrder = (order) =>
  order?.market === "forex" ||
  order?.assetClass === "forex" ||
  order?.closePrice !== undefined ||
  order?.openPrice !== undefined ||
  order?.profit !== undefined ||
  order?.accountLabel;

const getOrderAmount = (order) =>
  firstNumber(order?.amount, order?.quantity, order?.executedQuantity);

const getOrderPrice = (order) =>
  firstNumber(order?.executionPrice, order?.price, order?.openPrice);

const getOrderTotal = (order) => {
  const explicit = firstNumber(order?.total, order?.value, order?.notional);
  if (explicit) return explicit;
  return getOrderPrice(order) * getOrderAmount(order);
};

const formatPrice = (value) => {
  const number = toNumber(value);
  const absoluteNumber = Math.abs(number);
  if (absoluteNumber >= 1000) {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });
  }
  if (absoluteNumber >= 1) return number.toFixed(3).replace(/0$/, "");
  if (absoluteNumber >= 0.01) return number.toFixed(4);
  return number.toFixed(8);
};

const formatMoney = (value) => toNumber(value).toFixed(2);

const valueClass = (value, fallback = "") =>
  toNumber(value) < 0 ? "text-red-500" : fallback;

const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
};

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

const ForexRow = ({ order, onClick }) => {
  const side = (order.side || "buy").toLowerCase();
  const isBuy = side === "buy";
  const openPrice = firstNumber(order.openPrice, order.executionPrice, order.price);
  const closePrice = firstNumber(order.closePrice, order.currentPrice);
  const profit = firstNumber(order.profit, order.total);

  return (
    <button
      type="button"
      className={`relative block w-full py-1.5 pl-2 text-left ${
        !isBuy ? "border-l-4 border-red-500" : ""
      }`}
      onClick={() => onClick(order)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">
            {order.symbol}
            <span className={isBuy ? "text-blue-500" : "text-red-500"}>
              {" "}
              {side} {formatPrice(getOrderAmount(order))}
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
};

ForexRow.propTypes = {
  order: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ForexSummary = ({ orders }) => {
  const summary = [...orders].reverse().find(
    (order) =>
      isForexOrder(order) &&
      (order.deposit !== undefined ||
        order.balance !== undefined ||
        order.swap !== undefined ||
        order.commission !== undefined),
  );
  if (!summary) return null;

  const profit = orders.filter(isForexOrder).reduce((sum, order) => {
    return sum + firstNumber(order.profit);
  }, 0);
  const deposit = firstNumber(summary.deposit);
  const swap = firstNumber(summary.swap);
  const commission = firstNumber(summary.commission);
  const balance = deposit + profit + swap + commission;

  return (
    <div className="space-y-0.5 pt-2 text-base text-white">
      <div className="flex justify-between">
        <span>Deposit</span>
        <span className={valueClass(deposit)}>{formatMoney(deposit)}</span>
      </div>
      <div className="flex justify-between">
        <span>Profit</span>
        <span className={valueClass(profit)}>{formatMoney(profit)}</span>
      </div>
      <div className="flex justify-between">
        <span>Swap</span>
        <span className={valueClass(swap)}>{formatMoney(swap)}</span>
      </div>
      <div className="flex justify-between">
        <span>Commission</span>
        <span className={valueClass(commission)}>{formatMoney(commission)}</span>
      </div>
      <div className="flex justify-between">
        <span>Balance</span>
        <span className={valueClass(balance)}>{formatMoney(balance)}</span>
      </div>
    </div>
  );
};

ForexSummary.propTypes = {
  orders: PropTypes.array.isRequired,
};

const OrderHistory = ({
  variant = "standard",
  showHeader = true,
  showOrders = false,
  showHistory = true,
  maxItems = null,
  className = "",
  onOrderClick = () => {},
}) => {
  const dispatch = useDispatch();
  const openOrders = useSelector(selectOpenOrders) || [];
  const orderHistory = useSelector(selectOrderHistory) || [];
  const status = useSelector(selectTradingStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const showOpenOrders = showOrders && !showHistory;
  const ordersToDisplay = showOpenOrders ? openOrders : orderHistory;
  const title = showOpenOrders ? "Open Orders" : "Order History";

  useEffect(() => {
    if (showOpenOrders) {
      dispatch(fetchOrders({ status: ["new", "partially_filled"] }));
      return;
    }

    dispatch(fetchTradingHistory({}));
  }, [dispatch, showOpenOrders]);

  const filteredOrders = searchTerm
    ? ordersToDisplay.filter(
        (order) =>
          (order.symbol || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.id || order._id || "").toString().includes(searchTerm),
      )
    : ordersToDisplay;
  const limitedOrders = maxItems ? filteredOrders.slice(0, maxItems) : filteredOrders;
  const totalPages = Math.max(1, Math.ceil(limitedOrders.length / itemsPerPage));
  const paginatedOrders = limitedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const isLoading = status === "loading";
  const hasForex = limitedOrders.some(isForexOrder);

  if (!isLoading && ordersToDisplay.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        {showHeader && <h3 className="text-sm font-medium text-white mb-4">{title}</h3>}
        <div className="py-6 text-center text-gray-400">
          {showOpenOrders ? "No open orders found" : "No order history found"}
        </div>
      </div>
    );
  }

  const Pagination = () => (
    <div className="flex items-center justify-center gap-2 mt-4">
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

  const SearchBox = () => (
    <div className="relative">
      <input
        type="text"
        placeholder="Search orders..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full md:w-48 pl-8 pr-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-white"
      />
      <FaSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={12}
      />
    </div>
  );

  const CompactList = () => (
    <div className={hasForex ? "bg-black p-2" : "divide-y divide-gray-700"}>
      {paginatedOrders.map((order) =>
        isForexOrder(order) ? (
          <ForexRow key={order.id || order._id} order={order} onClick={onOrderClick} />
        ) : (
          <button
            type="button"
            key={order.id || order._id}
            className="block w-full p-3 text-left hover:bg-gray-700/50 transition-colors"
            onClick={() => onOrderClick(order)}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-white">{order.symbol}</span>
              <span className={order.side === "buy" ? "text-green-400" : "text-red-400"}>
                {(order.side || "").toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-gray-400">Price</span>
              <span className={`text-right ${valueClass(getOrderPrice(order), "text-white")}`}>${formatPrice(getOrderPrice(order))}</span>
              <span className="text-gray-400">Amount</span>
              <span className={`text-right ${valueClass(getOrderAmount(order), "text-white")}`}>{formatPrice(getOrderAmount(order))}</span>
              <span className="text-gray-400">Total</span>
              <span className={`text-right ${valueClass(getOrderTotal(order), "text-white")}`}>${formatPrice(getOrderTotal(order))}</span>
            </div>
          </button>
        ),
      )}
      <ForexSummary orders={limitedOrders} />
    </div>
  );

  if (variant === "mini" || variant === "compact") {
    return (
      <div className={`${hasForex ? "bg-black" : "bg-gray-800"} rounded-lg ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">
              {variant === "mini" ? "Recent Orders" : title}
            </h3>
            {isLoading && <FaSpinner className="animate-spin text-gray-400" size={14} />}
          </div>
        )}
        {variant === "compact" && (
          <div className="px-3 py-2 border-b border-gray-700">
            <SearchBox />
          </div>
        )}
        {isLoading && ordersToDisplay.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">Loading order history...</div>
        ) : (
          <CompactList />
        )}
      </div>
    );
  }

  return (
    <div className={`${hasForex ? "bg-black" : "bg-gray-800"} rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 gap-2">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <div className="flex items-center gap-2">
            <SearchBox />
            {isLoading && <FaSpinner className="animate-spin text-gray-400" size={14} />}
          </div>
        </div>
      )}

      {isLoading && ordersToDisplay.length === 0 ? (
        <div className="p-6 text-center text-sm text-gray-400">Loading order history...</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            {hasForex ? (
              <div className="p-4">
                <CompactList />
                <Pagination />
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      {["Date", "Pair", "Type", "Side", "Price", "Amount", "Total", "Fee"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className={`px-4 py-3 text-xs font-medium text-gray-400 uppercase ${
                              ["Price", "Amount", "Total", "Fee"].includes(heading)
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id || order._id}
                        className="hover:bg-gray-700/30 cursor-pointer"
                        onClick={() => onOrderClick(order)}
                      >
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {formatDateTime(order.date || order.processedAt || order.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-white">{order.symbol}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 capitalize">{order.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 uppercase">{order.side}</td>
                        <td className={`px-4 py-3 text-sm text-right ${valueClass(getOrderPrice(order), "text-gray-300")}`}>
                          ${formatPrice(getOrderPrice(order))}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right ${valueClass(getOrderAmount(order), "text-gray-300")}`}>
                          {formatPrice(getOrderAmount(order))}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-medium ${valueClass(getOrderTotal(order), "text-white")}`}>
                          ${formatPrice(getOrderTotal(order))}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right ${valueClass(firstNumber(order.fee, order.commission), "text-gray-300")}`}>
                          ${formatPrice(firstNumber(order.fee, order.commission))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination />
              </>
            )}
          </div>

          <div className="md:hidden p-4">
            <CompactList />
            <Pagination />
          </div>
        </>
      )}
    </div>
  );
};

OrderHistory.propTypes = {
  variant: PropTypes.oneOf(["standard", "compact", "mini"]),
  showHeader: PropTypes.bool,
  showOrders: PropTypes.bool,
  showHistory: PropTypes.bool,
  maxItems: PropTypes.number,
  className: PropTypes.string,
  onOrderClick: PropTypes.func,
};

export default OrderHistory;
