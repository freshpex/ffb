import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import {
  fetchTradingHistory,
  selectOrderHistory,
  selectTradingStatus
} from '../../redux/slices/tradingSlice';

/**
 * Reusable component for displaying order/trade history
 */
const OrderHistory = ({ 
  variant = 'standard', // 'standard', 'compact', 'mini'
  showHeader = true,
  maxItems = null,
  className = '',
  onOrderClick = () => {}
}) => {
  const dispatch = useDispatch();
  const orderHistory = useSelector(selectOrderHistory);
  console.log("order history", orderHistory)
  const status = useSelector(selectTradingStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive layout
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile(); // Initial check
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Load order history on mount
  useEffect(() => {
    if (status.orderHistory !== 'loading') {
      dispatch(fetchTradingHistory());
      console.log("Fetch order history", fetchTradingHistory)
    }
  }, [dispatch, status.orderHistory]);
  
  // Format date/time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Format price with correct precision based on value
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
  
  // Filter orders by search term
  const filteredOrders = searchTerm
    ? orderHistory.filter(order => 
        order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
      )
    : orderHistory;
  
  // Apply maxItems limit if set
  const displayOrders = maxItems ? filteredOrders.slice(0, maxItems) : filteredOrders;
  
  // Check if orders are loading
  const isLoading = status.orderHistory === 'loading';
  
  // Handle empty state
  if (!isLoading && (!orderHistory || orderHistory.length === 0)) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        {showHeader && (
          <h3 className="text-sm font-medium text-white mb-4">Order History</h3>
        )}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="text-gray-400 mb-2">No order history found</div>
          <div className="text-sm text-gray-500 max-w-md">
            Your completed trades will appear here once you start trading.
          </div>
        </div>
      </div>
    );
  }
  
  // Mini variant (for widget displays)
  if (variant === 'mini') {
    return (
      <div className={`bg-gray-800 rounded-lg ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Recent Orders</h3>
            {isLoading && (
              <FaSpinner className="animate-spin text-gray-400" size={14} />
            )}
          </div>
        )}
        
        {isLoading && orderHistory.length === 0 ? (
          <div className="p-3 text-center">
            <FaSpinner className="animate-spin text-gray-400 mx-auto" size={18} />
            <p className="text-xs text-gray-400 mt-2">Loading history...</p>
          </div>
        ) : (
          <div className="text-xs">
            {displayOrders.map((order) => (
              <div 
                key={order.id}
                className="px-3 py-2 border-b border-gray-700 last:border-0 hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => onOrderClick(order)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white">{order.symbol}</div>
                  <div className={`px-1.5 py-0.5 rounded text-xs ${
                    order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {order.side.toUpperCase()}
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-gray-400">
                  <div>{formatPrice(order.amount)}</div>
                  <div>${formatPrice(order.price)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`bg-gray-800 rounded-lg ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Order History</h3>
            {isLoading && (
              <FaSpinner className="animate-spin text-gray-400" size={14} />
            )}
          </div>
        )}
        
        {/* Search input */}
        <div className="px-3 py-2 border-b border-gray-700">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
          </div>
        </div>
        
        {isLoading && orderHistory.length === 0 ? (
          <div className="p-4 text-center">
            <FaSpinner className="animate-spin text-gray-400 mx-auto" size={20} />
            <p className="text-sm text-gray-400 mt-2">Loading order history...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
            {displayOrders.map((order) => (
              <div 
                key={order.id} 
                className="p-3 hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => onOrderClick(order)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-white">{order.symbol}</span>
                  <div className={`px-1.5 py-0.5 rounded text-xs ${
                    order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {order.side.toUpperCase()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-1">
                  <div className="text-gray-400">Price:</div>
                  <div className="text-right text-white">${formatPrice(order.price)}</div>
                  <div className="text-gray-400">Amount:</div>
                  <div className="text-right text-white">{formatPrice(order.amount)}</div>
                  <div className="text-gray-400">Total:</div>
                  <div className="text-right text-white">${formatPrice(order.total || order.price * order.amount)}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDateTime(order.date || order.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Standard variant (default)
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-wrap gap-2">
          <h3 className="text-sm font-medium text-white">Order History</h3>
          <div className="flex items-center">
            <div className="relative mr-2">
              <input 
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-48 pl-8 pr-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-white"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
            </div>
            {isLoading && (
              <FaSpinner className="animate-spin text-gray-400" size={14} />
            )}
          </div>
        </div>
      )}
      
      {isLoading && orderHistory.length === 0 ? (
        <div className="p-6 text-center">
          <FaSpinner className="animate-spin text-gray-400 mx-auto" size={24} />
          <p className="text-sm text-gray-400 mt-3">Loading order history...</p>
        </div>
      ) : (
        <>
          {/* Desktop view (table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pair</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Side</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {displayOrders.map((order) => (
                  <tr 
                    key={order.id}
                    className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => onOrderClick(order)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {formatDateTime(order.date || order.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-white">{order.symbol}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-300 capitalize">{order.type}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                      ${formatPrice(order.price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-white">
                      ${formatPrice(order.total || (order.price * order.amount))}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                      ${formatPrice(order.fee || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile view (card layout) */}
          <div className="md:hidden divide-y divide-gray-700">
            {displayOrders.map((order) => (
              <div 
                key={order.id} 
                className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => onOrderClick(order)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">{order.symbol}</span>
                  <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                    order.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.side.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-gray-400">Date:</div>
                  <div className="text-gray-300">{formatDateTime(order.date || order.createdAt)}</div>
                  
                  <div className="text-gray-400">Type:</div>
                  <div className="text-gray-300 capitalize">{order.type}</div>
                  
                  <div className="text-gray-400">Price:</div>
                  <div className="text-gray-300">${formatPrice(order.price)}</div>
                  
                  <div className="text-gray-400">Amount:</div>
                  <div className="text-gray-300">{formatPrice(order.amount)}</div>
                  
                  <div className="text-gray-400">Total:</div>
                  <div className="font-medium text-white">${formatPrice(order.total || (order.price * order.amount))}</div>
                  
                  <div className="text-gray-400">Fee:</div>
                  <div className="text-gray-300">${formatPrice(order.fee || 0)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

OrderHistory.propTypes = {
  variant: PropTypes.oneOf(['standard', 'compact', 'mini']),
  showHeader: PropTypes.bool,
  maxItems: PropTypes.number,
  className: PropTypes.string,
  onOrderClick: PropTypes.func
};

export default OrderHistory;