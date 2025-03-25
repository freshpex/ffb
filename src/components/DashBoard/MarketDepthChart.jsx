import { useState, useEffect, useRef } from 'react';
import { FaChartArea, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const MarketDepthChart = ({ symbol }) => {
  const [depthData, setDepthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const fetchMarketDepth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real application, this would fetch from an API
        // For now, we'll generate mock data
        const mockDepthData = {
          bids: Array.from({ length: 50 }, (_, i) => {
            const basePrice = symbol.startsWith('BTC') ? 64000 : 
                             symbol.startsWith('ETH') ? 3400 : 
                             symbol.startsWith('LTC') ? 75 : 
                             symbol.startsWith('XRP') ? 0.55 : 
                             symbol.startsWith('ADA') ? 1.2 : 
                             symbol.startsWith('DOGE') ? 0.12 : 50;
            
            // Price decreases as we go down the bids
            const price = basePrice - (i * basePrice * 0.0005);
            // Amount gets larger as price gets lower (more buyers at lower prices)
            const amount = (1 + Math.random() * 5) * (1 + i * 0.1);
            
            return [price, amount];
          }),
          asks: Array.from({ length: 50 }, (_, i) => {
            const basePrice = symbol.startsWith('BTC') ? 64100 : 
                             symbol.startsWith('ETH') ? 3420 : 
                             symbol.startsWith('LTC') ? 76 : 
                             symbol.startsWith('XRP') ? 0.56 : 
                             symbol.startsWith('ADA') ? 1.22 : 
                             symbol.startsWith('DOGE') ? 0.123 : 51;
            
            // Price increases as we go up the asks
            const price = basePrice + (i * basePrice * 0.0005);
            // Amount gets smaller as price gets higher (fewer sellers at higher prices)
            const amount = (3 + Math.random() * 5) * (1 - i * 0.005 + 0.5);
            
            return [price, amount];
          })
        };
        
        setDepthData(mockDepthData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching market depth:', err);
        setError('Failed to load market depth data');
        setIsLoading(false);
      }
    };
    
    fetchMarketDepth();
    
    // Update every 10 seconds for a realistic feel
    const intervalId = setInterval(fetchMarketDepth, 10000);
    return () => clearInterval(intervalId);
  }, [symbol]);
  
  useEffect(() => {
    if (!depthData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate scales
    const bids = depthData.bids;
    const asks = depthData.asks;
    
    // Find min/max prices
    const minBidPrice = Math.min(...bids.map(bid => bid[0]));
    const maxAskPrice = Math.max(...asks.map(ask => ask[0]));
    const priceRange = maxAskPrice - minBidPrice;
    
    // Find max volume for scaling
    const maxBidVolume = Math.max(...bids.map(bid => bid[1]));
    const maxAskVolume = Math.max(...asks.map(ask => ask[1]));
    const maxVolume = Math.max(maxBidVolume, maxAskVolume);
    
    // Set up coordinate transformations
    const priceToX = (price) => ((price - minBidPrice) / priceRange) * canvasWidth;
    const volumeToY = (volume) => canvasHeight - (volume / maxVolume) * canvasHeight;
    
    // Draw bids (green/buy side)
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    
    bids.forEach((bid, index) => {
      const x = priceToX(bid[0]);
      const y = volumeToY(bid[1]);
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(0, volumeToY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(39, 174, 96, 0.3)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    bids.forEach((bid, index) => {
      const x = priceToX(bid[0]);
      const y = volumeToY(bid[1]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = 'rgb(39, 174, 96)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw asks (red/sell side)
    ctx.beginPath();
    ctx.moveTo(priceToX(asks[0][0]), volumeToY(0));
    
    asks.forEach((ask) => {
      const x = priceToX(ask[0]);
      const y = volumeToY(ask[1]);
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(canvasWidth, volumeToY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
    ctx.fill();
    
    ctx.beginPath();
    asks.forEach((ask, index) => {
      const x = priceToX(ask[0]);
      const y = volumeToY(ask[1]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = 'rgb(231, 76, 60)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw midpoint line
    const midPrice = (minBidPrice + maxAskPrice) / 2;
    const midX = priceToX(midPrice);
    
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, canvasHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw price labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    
    // Price at left edge (lowest bid)
    ctx.fillText(minBidPrice.toFixed(2), 30, canvasHeight - 5);
    
    // Mid price
    ctx.fillText(midPrice.toFixed(2), midX, canvasHeight - 5);
    
    // Price at right edge (highest ask)
    ctx.fillText(maxAskPrice.toFixed(2), canvasWidth - 30, canvasHeight - 5);
    
  }, [depthData]);
  
  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else {
      return price.toPrecision(4);
    }
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
        <span className="ml-3 text-gray-400">Loading market depth...</span>
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
    <div className="w-full h-full flex flex-col bg-gray-900 text-white" ref={chartRef}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-medium flex items-center">
          <FaChartArea className="mr-2 text-primary-500" /> 
          Market Depth: {symbol}
        </h3>
        {depthData && (
          <div className="text-xs text-gray-400">
            <span className="text-green-400 mr-2">Bid: {formatPrice(depthData.bids[0][0])}</span>
            <span className="text-red-400">Ask: {formatPrice(depthData.asks[0][0])}</span>
          </div>
        )}
      </div>
      <div className="flex-1 p-2 relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          width={800} 
          height={300}
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-gray-900/80 px-2 py-1 rounded">
          <span className="inline-block w-3 h-3 bg-green-500/70 mr-1"></span> Bids
          <span className="inline-block w-3 h-3 bg-red-500/70 mx-1 ml-3"></span> Asks
        </div>
      </div>
    </div>
  );
};

MarketDepthChart.propTypes = {
  symbol: PropTypes.string.isRequired
};

export default MarketDepthChart;
