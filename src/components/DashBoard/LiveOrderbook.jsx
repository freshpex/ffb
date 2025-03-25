import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const LiveOrderbook = ({ symbol }) => {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(1000);
  
  useEffect(() => {
    // Reset on symbol change
    setIsLoading(true);
    setError(null);
    
    const generateMockOrderbook = () => {
      // This simulates what would be fetched from a real API
      // Constants for price generation
      const basePrice = symbol.startsWith('BTC') ? 64000 :
                       symbol.startsWith('ETH') ? 3400 :
                       symbol.startsWith('LTC') ? 75 :
                       symbol.startsWith('XRP') ? 0.55 :
                       symbol.startsWith('ADA') ? 1.2 :
                       symbol.startsWith('DOGE') ? 0.12 : 50;
      
      const minSpread = basePrice * 0.0002; // 0.02% spread
      const midPrice = basePrice + (Math.random() * basePrice * 0.002 - basePrice * 0.001); // +/- 0.1%
      
      // Generate bids - ordered by price descending
      const bids = Array.from({ length: 15 }, (_, i) => {
        const price = midPrice - (minSpread / 2) - (i * basePrice * 0.0005);
        const amount = (1 + Math.random() * 5) * (1 + Math.random() * 0.5);
        return {
          price,
          amount,
          total: price * amount,
          id: `bid-${Date.now()}-${i}`
        };
      }).sort((a, b) => b.price - a.price); // Sort by price descending
      
      // Generate asks - ordered by price ascending
      const asks = Array.from({ length: 15 }, (_, i) => {
        const price = midPrice + (minSpread / 2) + (i * basePrice * 0.0005);
        const amount = (1 + Math.random() * 5) * (1 - Math.random() * 0.3 + 0.3);
        return {
          price,
          amount,
          total: price * amount,
          id: `ask-${Date.now()}-${i}`
        };
      }).sort((a, b) => a.price - b.price); // Sort by price ascending
      
      return { bids, asks };
    };
    
    const updateOrderbook = () => {
      try {
        const newOrderbook = generateMockOrderbook();
        setOrderbook(newOrderbook);
        setIsLoading(false);
      } catch (err) {
        console.error('Error updating orderbook:', err);
        setError('Failed to load orderbook data');
        setIsLoading(false);
      }
    };
    
    updateOrderbook();
    
    const intervalId = setInterval(updateOrderbook, refreshInterval);
    return () => clearInterval(intervalId);
  }, [symbol, refreshInterval]);
  
  // Calculate the maximum amount for visualization
  const maxAmount = Math.max(
    ...orderbook.bids.map(bid => bid.amount),
    ...orderbook.asks.map(ask => ask.amount)
  );
  
  // Format price based on its magnitude
  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else {
      return price.toPrecision(4);
    }
  };
  
  // Format amount with appropriate decimal places
  const formatAmount = (amount) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary-500"
        >
          <FaSpinner size={30} />
        </motion.div>
        <span className="ml-3 text-gray-400">Loading orderbook...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
        <FaExclamationTriangle className="text-red-500 text-3xl mb-2" />
        <p className="text-gray-300">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-medium flex items-center">
          <FaBook className="mr-2 text-primary-500" /> 
          Orderbook: {symbol}
        </h3>
        <div className="flex space-x-2">
          <select 
            className="bg-gray-800 text-xs text-gray-300 border border-gray-700 rounded px-2 py-1"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
          >
            <option value={500}>0.5s</option>
            <option value={1000}>1s</option>
            <option value={2000}>2s</option>
            <option value={5000}>5s</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 gap-1 px-4 py-2 text-xs font-medium text-gray-400 border-b border-gray-700">
          <div>Price</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Asks */}
        <div className="flex-1 overflow-y-auto">
          {orderbook.asks.map((ask) => (
            <div 
              key={ask.id} 
              className="grid grid-cols-3 gap-1 px-4 py-1 text-xs border-b border-gray-800 relative hover:bg-gray-800/30"
            >
              <div className="text-red-400">{formatPrice(ask.price)}</div>
              <div className="text-right">{formatAmount(ask.amount)}</div>
              <div className="text-right text-gray-400">{formatAmount(ask.total)}</div>
              
              {/* Background depth visualization */}
              <div 
                className="absolute right-0 top-0 h-full bg-red-900/20" 
                style={{ width: `${(ask.amount / maxAmount) * 100}%`, maxWidth: '100%' }}
              ></div>
            </div>
          ))}
        </div>
        
        {/* Spread */}
        <div className="px-4 py-2 text-xs font-medium text-gray-400 border-t border-b border-gray-700 bg-gray-800/40">
          <div className="flex justify-between">
            <span>Spread:</span>
            <span>
              {orderbook.asks.length > 0 && orderbook.bids.length > 0 
                ? `${(orderbook.asks[0].price - orderbook.bids[0].price).toFixed(2)} (${((orderbook.asks[0].price - orderbook.bids[0].price) / orderbook.asks[0].price * 100).toFixed(2)}%)`
                : '-'
              }
            </span>
          </div>
        </div>
        
        {/* Bids */}
        <div className="flex-1 overflow-y-auto">
          {orderbook.bids.map((bid) => (
            <div 
              key={bid.id} 
              className="grid grid-cols-3 gap-1 px-4 py-1 text-xs border-b border-gray-800 relative hover:bg-gray-800/30"
            >
              <div className="text-green-400">{formatPrice(bid.price)}</div>
              <div className="text-right">{formatAmount(bid.amount)}</div>
              <div className="text-right text-gray-400">{formatAmount(bid.total)}</div>
              
              {/* Background depth visualization */}
              <div 
                className="absolute right-0 top-0 h-full bg-green-900/20" 
                style={{ width: `${(bid.amount / maxAmount) * 100}%`, maxWidth: '100%' }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

LiveOrderbook.propTypes = {
  symbol: PropTypes.string.isRequired
};

export default LiveOrderbook;
