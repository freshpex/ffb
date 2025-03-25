import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaThermometerHalf, FaChartBar, FaBitcoin, FaSync } from 'react-icons/fa';

const MarketPulse = () => {
  const [pulseData, setPulseData] = useState({
    fearGreedIndex: {
      value: 65,
      status: 'Greed',
      change: 3,
      chartData: [40, 42, 45, 50, 55, 60, 65]
    },
    btcDominance: {
      value: 52.7,
      change: -0.8,
      chartData: [54.5, 54.0, 53.5, 53.2, 52.8, 52.7]
    },
    totalMarketCap: {
      value: 1.8,
      unit: 'T',
      change: 2.1,
      chartData: [1.72, 1.73, 1.75, 1.77, 1.79, 1.80]
    },
    btcHashRate: {
      value: 420.5,
      unit: 'EH/s',
      change: 5.3,
      chartData: [380.5, 395.2, 401.8, 410.3, 415.7, 420.5]
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Function to simulate data fetching
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add some random variations to data
      setPulseData(prevData => {
        const randomChange = (min, max) => Math.random() * (max - min) + min;
        
        return {
          fearGreedIndex: {
            ...prevData.fearGreedIndex,
            value: Math.min(100, Math.max(0, Math.round(prevData.fearGreedIndex.value + randomChange(-5, 5)))),
            change: randomChange(-2, 2).toFixed(1),
            chartData: [...prevData.fearGreedIndex.chartData.slice(1), 
                       Math.min(100, Math.max(0, Math.round(prevData.fearGreedIndex.value + randomChange(-3, 3))))]
          },
          btcDominance: {
            ...prevData.btcDominance,
            value: Math.max(30, Math.min(90, (parseFloat(prevData.btcDominance.value) + randomChange(-0.5, 0.5)).toFixed(1))),
            change: randomChange(-1, 1).toFixed(1),
            chartData: [...prevData.btcDominance.chartData.slice(1), 
                       parseFloat(prevData.btcDominance.value) + randomChange(-0.3, 0.3)]
          },
          totalMarketCap: {
            ...prevData.totalMarketCap,
            value: Math.max(0.5, (parseFloat(prevData.totalMarketCap.value) + randomChange(-0.05, 0.05)).toFixed(1)),
            change: randomChange(-1, 3).toFixed(1),
            chartData: [...prevData.totalMarketCap.chartData.slice(1), 
                       parseFloat(prevData.totalMarketCap.value) + randomChange(-0.02, 0.02)]
          },
          btcHashRate: {
            ...prevData.btcHashRate,
            value: Math.max(200, (parseFloat(prevData.btcHashRate.value) + randomChange(-10, 10)).toFixed(1)),
            change: randomChange(-2, 8).toFixed(1),
            chartData: [...prevData.btcHashRate.chartData.slice(1), 
                       parseFloat(prevData.btcHashRate.value) + randomChange(-5, 5)]
          }
        };
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching market pulse data:', err);
      setError('Failed to update market data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Update every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Mini chart rendering function
  const renderMiniChart = (data, color, isPositive) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d={`M0,${100 - ((data[0] - min) / range) * 100} L${points} L100,${100 - ((data[data.length - 1] - min) / range) * 100} L100,100 L0,100 Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
        />
        <path
          d={`M0,${100 - ((data[0] - min) / range) * 100} L${points}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
  };

  // Function to get color based on sentiment
  const getSentimentColor = (value) => {
    if (value < 30) return '#ff4b5c'; // Fear
    if (value < 50) return '#ff9800'; // Neutral to fearful
    if (value < 70) return '#4caf50'; // Neutral to greedy
    return '#2196f3'; // Extreme greed
  };
  
  // Format datetime
  const formatLastUpdate = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FaThermometerHalf className="mr-2 text-primary-500" /> Market Pulse
        </h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">
            Last updated: {formatLastUpdate(lastUpdate)}
          </span>
          <button 
            className={`p-2 text-gray-400 hover:text-primary-500 rounded-full hover:bg-gray-700 transition-colors ${isLoading ? 'animate-spin text-primary-500' : ''}`}
            onClick={fetchData}
            disabled={isLoading}
            aria-label="Refresh data"
          >
            <FaSync />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-500 rounded-md text-red-400 flex justify-between items-center">
            {error}
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              &times;
            </button>
          </div>
        )}
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-400">Fear & Greed Index</h3>
            </div>
            <h4 className="text-2xl font-bold" style={{ color: getSentimentColor(pulseData.fearGreedIndex.value) }}>
              {pulseData.fearGreedIndex.value} - {pulseData.fearGreedIndex.status}
            </h4>
            <div className={`flex items-center text-sm mt-1 mb-3 ${pulseData.fearGreedIndex.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pulseData.fearGreedIndex.change > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(pulseData.fearGreedIndex.change)} points
            </div>
            <div className="h-12 w-full">
              {renderMiniChart(pulseData.fearGreedIndex.chartData, getSentimentColor(pulseData.fearGreedIndex.value), pulseData.fearGreedIndex.change > 0)}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-400">BTC Dominance</h3>
            </div>
            <h4 className="text-2xl font-bold text-white">
              {pulseData.btcDominance.value}%
            </h4>
            <div className={`flex items-center text-sm mt-1 mb-3 ${pulseData.btcDominance.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pulseData.btcDominance.change > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(pulseData.btcDominance.change)}%
            </div>
            <div className="h-12 w-full">
              {renderMiniChart(pulseData.btcDominance.chartData, '#f7931a', pulseData.btcDominance.change > 0)}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-400">Total Market Cap</h3>
            </div>
            <h4 className="text-2xl font-bold text-white">
              ${pulseData.totalMarketCap.value}{pulseData.totalMarketCap.unit}
            </h4>
            <div className={`flex items-center text-sm mt-1 mb-3 ${pulseData.totalMarketCap.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pulseData.totalMarketCap.change > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(pulseData.totalMarketCap.change)}%
            </div>
            <div className="h-12 w-full">
              {renderMiniChart(pulseData.totalMarketCap.chartData, '#2196f3', pulseData.totalMarketCap.change > 0)}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-400">BTC Hash Rate</h3>
            </div>
            <h4 className="text-2xl font-bold text-white">
              {pulseData.btcHashRate.value} {pulseData.btcHashRate.unit}
            </h4>
            <div className={`flex items-center text-sm mt-1 mb-3 ${pulseData.btcHashRate.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pulseData.btcHashRate.change > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(pulseData.btcHashRate.change)}%
            </div>
            <div className="h-12 w-full">
              {renderMiniChart(pulseData.btcHashRate.chartData, '#9c27b0', pulseData.btcHashRate.change > 0)}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketPulse;
