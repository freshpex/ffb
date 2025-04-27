import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { selectOrderBook } from "../../redux/slices/tradingSlice";

const LiveOrderbook = ({ symbol }) => {
  const orderBook = useSelector(selectOrderBook);
  const [sortedAsks, setSortedAsks] = useState([]);
  const [sortedBids, setSortedBids] = useState([]);
  const [maxTotal, setMaxTotal] = useState(0);
  console.log("Order book", orderBook);

  useEffect(() => {
    if (orderBook && orderBook.asks && orderBook.bids) {
      // Sort asks in ascending order (lowest first)
      const asks = [...orderBook.asks].slice(0, 12);
      // Sort bids in descending order (highest first)
      const bids = [...orderBook.bids].slice(0, 12);

      // Calculate max total for depth visualization
      const allTotals = [...asks, ...bids]
        .filter((o) => o && o.total)
        .map((o) => o.total);
      const max = allTotals.length > 0 ? Math.max(...allTotals) : 0;

      setSortedAsks(asks);
      setSortedBids(bids);
      setMaxTotal(max || 1); // Prevent divide by zero
    }
  }, [orderBook]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "0.00";

    if (price >= 1000) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else if (price >= 0.01) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8);
    }
  };

  const formatQuantity = (quantity) => {
    if (!quantity && quantity !== 0) return "0.000000";
    return quantity.toFixed(6);
  };

  const formatTotal = (total) => {
    if (!total && total !== 0) return "0.00";
    return total.toFixed(2);
  };

  // Calculate spread safely
  const calculateSpread = () => {
    if (
      sortedAsks.length > 0 &&
      sortedBids.length > 0 &&
      sortedAsks[0]?.price &&
      sortedBids[0]?.price
    ) {
      const askPrice = sortedAsks[0].price;
      const bidPrice = sortedBids[0].price;
      const spread = ((askPrice - bidPrice) / askPrice) * 100;
      return spread.toFixed(3);
    }
    return "0.000";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Order Book</h3>
        <div className="text-xs text-gray-400">{symbol}</div>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">
                Price
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400">
                Amount
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="text-white">
            {/* Asks (sell orders) */}
            {sortedAsks.map((ask, index) => (
              <tr key={`ask-${index}`} className="hover:bg-gray-750">
                <td className="px-3 py-1 text-red-500">
                  {formatPrice(ask?.price)}
                </td>
                <td className="px-3 py-1 text-right">
                  {formatQuantity(ask?.quantity)}
                </td>
                <td className="px-3 py-1 text-right relative">
                  <div
                    className="absolute top-0 bottom-0 right-0 bg-red-900/30"
                    style={{
                      width: `${maxTotal && ask?.total ? (ask.total / maxTotal) * 100 : 0}%`,
                    }}
                  ></div>
                  <span className="relative z-10">
                    {formatTotal(ask?.total)}
                  </span>
                </td>
              </tr>
            ))}

            {/* Spread indicator */}
            {sortedAsks.length > 0 && sortedBids.length > 0 && (
              <tr className="bg-gray-800">
                <td
                  colSpan="3"
                  className="px-3 py-1 text-center text-xs text-gray-400"
                >
                  Spread: {calculateSpread()}%
                </td>
              </tr>
            )}

            {/* Bids (buy orders) */}
            {sortedBids.map((bid, index) => (
              <tr key={`bid-${index}`} className="hover:bg-gray-750">
                <td className="px-3 py-1 text-green-500">
                  {formatPrice(bid?.price)}
                </td>
                <td className="px-3 py-1 text-right">
                  {formatQuantity(bid?.quantity)}
                </td>
                <td className="px-3 py-1 text-right relative">
                  <div
                    className="absolute top-0 bottom-0 right-0 bg-green-900/30"
                    style={{
                      width: `${maxTotal && bid?.total ? (bid.total / maxTotal) * 100 : 0}%`,
                    }}
                  ></div>
                  <span className="relative z-10">
                    {formatTotal(bid?.total)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

LiveOrderbook.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default LiveOrderbook;
