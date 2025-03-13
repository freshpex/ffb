import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import binanceService from '../../services/binanceService';
import { FaSpinner } from 'react-icons/fa';

const LiveOrderbook = ({ symbol }) => {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxTotal, setMaxTotal] = useState(1);
  
  useEffect(() => {
    const fetchOrderbook = async () => {
      try {
        if (!symbol) return;
        
        setIsLoading(true);
        const data = await binanceService.getMarketDepth(symbol, 10);
        
        // Process bids and asks
        const processSide = (sideData) => {
          let cumulative = 0;
          return sideData.map(([price, quantity]) => {
            const numPrice = parseFloat(price);
            const numQuantity = parseFloat(quantity);
            cumulative += numQuantity;
            
            return {
              price: numPrice,
              quantity: numQuantity,
              total: cumulative,
              value: numPrice * numQuantity
            };
          });
        };
        
        const bids = processSide(data.bids);
        const asks = processSide(data.asks);
        
        // Find the maximum total for visualization
        const maxTotalBids = bids.length > 0 ? bids[bids.length - 1].total : 0;
        const maxTotalAsks = asks.length > 0 ? asks[asks.length - 1].total : 0;
        setMaxTotal(Math.max(maxTotalBids, maxTotalAsks));
        
        setOrderbook({ bids, asks });
        setIsLoading(false);
      } catch (err) {
        console.error(`Error fetching orderbook for ${symbol}:`, err);
        setError('Failed to load orderbook');
        setIsLoading(false);
      }
    };
    
    fetchOrderbook();
    
    // Update every 3 seconds
    const intervalId = setInterval(fetchOrderbook, 3000);
    return () => clearInterval(intervalId);
  }, [symbol]);
  
  // Format price based on the symbol's precision
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };
  
  // Animation variants
  const rowVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };
  
  // Calculate background gradient width based on total
  const getBackgroundWidth = (total) => {
    return `${(total / maxTotal) * 100}%`;
  };

  if (isLoading) {
    return (
      <div className="orderbook-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner size={20} />
        </motion.div>
        <span>Loading orderbook...</span>
      </div>
    );
  }

  if (error) {
    return <div className="orderbook-error">{error}</div>;
  }

  return (
    <div className="live-orderbook">
      <div className="orderbook-header">
        <h3 className="orderbook-title">{symbol} Order Book</h3>
      </div>
      
      <div className="orderbook-content">
        <div className="orderbook-section asks">
          <div className="orderbook-labels">
            <span>Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          
          <div className="orderbook-rows">
            <AnimatePresence>
              {orderbook.asks.map((ask, index) => (
                <motion.div 
                  key={`ask-${index}`}
                  className="orderbook-row ask"
                  variants={rowVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  <div 
                    className="depth-visualization asks-depth"
                    style={{ width: getBackgroundWidth(ask.total) }} 
                  />
                  <span className="price">{formatPrice(ask.price)}</span>
                  <span className="quantity">{ask.quantity.toFixed(4)}</span>
                  <span className="total">{ask.total.toFixed(4)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="orderbook-middle">
          <div className="orderbook-spread">
            <div className="spread-label">Spread:</div>
            <div className="spread-value">
              {orderbook.asks.length && orderbook.bids.length ? 
                `${(orderbook.asks[0].price - orderbook.bids[0].price).toFixed(2)} (${
                  ((orderbook.asks[0].price - orderbook.bids[0].price) / orderbook.asks[0].price * 100).toFixed(2)
                }%)` : 
                '—'
              }
            </div>
          </div>
        </div>
        
        <div className="orderbook-section bids">
          <div className="orderbook-labels">
            <span>Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          
          <div className="orderbook-rows">
            <AnimatePresence>
              {orderbook.bids.map((bid, index) => (
                <motion.div 
                  key={`bid-${index}`}
                  className="orderbook-row bid"
                  variants={rowVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  <div 
                    className="depth-visualization bids-depth"
                    style={{ width: getBackgroundWidth(bid.total) }} 
                  />
                  <span className="price">{formatPrice(bid.price)}</span>
                  <span className="quantity">{bid.quantity.toFixed(4)}</span>
                  <span className="total">{bid.total.toFixed(4)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveOrderbook;
