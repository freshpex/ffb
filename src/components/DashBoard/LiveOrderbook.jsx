import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaSync } from 'react-icons/fa';
import { selectOrderBook, selectSelectedPair } from '../../redux/slices/tradingSlice';

const LiveOrderbook = ({ symbol }) => {
  const orderBook = useSelector(selectOrderBook);
  const selectedPair = useSelector(selectSelectedPair);
  const [displayCount, setDisplayCount] = useState(10);
  
  // Format price based on value
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '0.00';
    
    if (price >= 1000) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else if (price >= 0.01) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8);
    }
  };
  
  // Format amount to appropriate decimal places
  const formatAmount = (amount) => {
    if (typeof amount !== 'number') return '0.00';
    
    if (amount >= 1) {
      return amount.toFixed(2);
    } else {
      return amount.toFixed(6);
    }
  };
  
  // Get the total amount of orders
  const getTotalAmount = (orders) => {
    return orders.reduce((sum, order) => sum + order.amount, 0).toFixed(4);
  };

  // Determine if orderbook is loading
  const isLoading = !orderBook || !orderBook.bids || !orderBook.asks || 
                     orderBook.bids.length === 0 || orderBook.asks.length === 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b border-gray-700 p-3 flex justify-between items-center">
        <h3 className="text-sm font-medium text-white">{symbol} Orderbook</h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <FaSync size={14} />
        </button>
      </div>
      
      <div className="flex text-xs text-gray-400 p-2 border-b border-gray-700">
        <div className="w-1/3 text-left">Price ({selectedPair?.quoteAsset})</div>
        <div className="w-1/3 text-right">Amount ({selectedPair?.baseAsset})</div>
        <div className="w-1/3 text-right">Total</div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading orderbook data...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Asks (Sell orders) - displayed in reverse order (lowest ask at bottom) */}
          <div className="flex-1 overflow-y-auto flex flex-col-reverse">
            {orderBook.asks.slice(0, displayCount).map((ask, index) => (
              <div 
                key={`ask-${index}`} 
                className="flex text-sm py-1 px-2 hover:bg-gray-700/30"
                style={{
                  background: `linear-gradient(to left, rgba(231, 76, 60, 0.05) ${Math.min(ask.amount / 5 * 100, 100)}%, transparent 0)`
                }}
              >
                <div className="w-1/3 text-left text-red-400">
                  {formatPrice(ask.price)}
                </div>
                <div className="w-1/3 text-right text-white">
                  {formatAmount(ask.amount)}
                </div>
                <div className="w-1/3 text-right text-gray-400">
                  {formatAmount(ask.total)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Spread information */}
          <div className="border-y border-gray-700 py-2 px-3 text-xs text-gray-400 flex justify-between">
            <span>Spread:</span>
            <span>
              {formatPrice(orderBook.asks[0].price - orderBook.bids[0].price)} 
              ({((orderBook.asks[0].price / orderBook.bids[0].price - 1) * 100).toFixed(2)}%)
            </span>
          </div>
          
          {/* Bids (Buy orders) */}
          <div className="flex-1 overflow-y-auto">
            {orderBook.bids.slice(0, displayCount).map((bid, index) => (
              <div 
                key={`bid-${index}`} 
                className="flex text-sm py-1 px-2 hover:bg-gray-700/30"
                style={{
                  background: `linear-gradient(to left, rgba(46, 204, 113, 0.05) ${Math.min(bid.amount / 5 * 100, 100)}%, transparent 0)`
                }}
              >
                <div className="w-1/3 text-left text-green-400">
                  {formatPrice(bid.price)}
                </div>
                <div className="w-1/3 text-right text-white">
                  {formatAmount(bid.amount)}
                </div>
                <div className="w-1/3 text-right text-gray-400">
                  {formatAmount(bid.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-700 p-2 text-center">
        <select 
          value={displayCount}
          onChange={(e) => setDisplayCount(Number(e.target.value))}
          className="bg-gray-700 text-white border border-gray-600 text-xs rounded px-2 py-1"
        >
          <option value="5">5 Rows</option>
          <option value="10">10 Rows</option>
          <option value="15">15 Rows</option>
          <option value="20">20 Rows</option>
        </select>
      </div>
    </div>
  );
};

LiveOrderbook.propTypes = {
  symbol: PropTypes.string.isRequired
};

export default LiveOrderbook;
