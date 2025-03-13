import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaThermometerHalf, FaChartBar, FaBitcoin, FaSync } from 'react-icons/fa';
import binanceService from '../../services/binanceService';

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

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        
        // Get BTC price from Binance to calculate recent change
        const btcData = await binanceService.get24hrStats('BTCUSDT');
        const ethData = await binanceService.get24hrStats('ETHUSDT');
        
        // Calculate BTC dominance (simplified calculation)
        const btcMarketCap = parseFloat(btcData.lastPrice) * 19000000; // Approximate circulating supply
        const ethMarketCap = parseFloat(ethData.lastPrice) * 120000000; // Approximate circulating supply
        const totalMarketCap = btcMarketCap + ethMarketCap + 500000000000; // Add estimated remainder
        const btcDominance = (btcMarketCap / totalMarketCap) * 100;
        
        // Update pulse data with real values where possible
        setPulseData(prevData => ({
          ...prevData,
          btcDominance: {
            ...prevData.btcDominance,
            value: btcDominance.toFixed(1),
            change: parseFloat((btcDominance - prevData.btcDominance.chartData[prevData.btcDominance.chartData.length - 2]).toFixed(1)),
            chartData: [...prevData.btcDominance.chartData.slice(1), btcDominance]
          },
          totalMarketCap: {
            ...prevData.totalMarketCap,
            value: (totalMarketCap / 1000000000000).toFixed(1),
            change: parseFloat(((totalMarketCap / 1000000000000 - prevData.totalMarketCap.value) / prevData.totalMarketCap.value * 100).toFixed(1)),
            chartData: [...prevData.totalMarketCap.chartData.slice(1), totalMarketCap / 1000000000000]
          }
        }));
        
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error fetching market pulse data:', err);
        setError('Failed to update market data');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchMarketData();
    
    // Update every 5 minutes
    const intervalId = setInterval(fetchMarketData, 5 * 60 * 1000);
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

  const handleRefresh = () => {
    // Manually trigger data refresh
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update last update timestamp
        setLastUpdate(new Date());
        
        // In a real implementation, we would fetch actual data here
        
      } catch (err) {
        console.error('Error refreshing market data:', err);
        setError('Failed to refresh market data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  };

  return (
    <motion.div 
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <h2 className="card-title">
          <FaThermometerHalf /> Market Pulse
        </h2>
        <div className="card-actions">
          <span className="last-update">
            Last updated: {formatLastUpdate(lastUpdate)}
          </span>
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <FaSync className={isLoading ? 'rotating' : ''} />
          </button>
        </div>
      </div>
      
      <div className="card-body">
        {error && (
          <div className="alert alert-error">
            {error} 
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        <motion.div 
          className="market-pulse"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="pulse-item" variants={itemVariants}>
            <div className="pulse-header">
              <h3 className="pulse-title">Fear & Greed Index</h3>
            </div>
            <h4 className="pulse-value" style={{ color: getSentimentColor(pulseData.fearGreedIndex.value) }}>
              {pulseData.fearGreedIndex.value} - {pulseData.fearGreedIndex.status}
            </h4>
            <div className={`pulse-trend ${pulseData.fearGreedIndex.change > 0 ? 'positive' : 'negative'}`}>
              {pulseData.fearGreedIndex.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(pulseData.fearGreedIndex.change)} points
            </div>
            <div className="pulse-chart">
              {renderMiniChart(pulseData.fearGreedIndex.chartData, getSentimentColor(pulseData.fearGreedIndex.value), pulseData.fearGreedIndex.change > 0)}
            </div>
          </motion.div>
          
          <motion.div className="pulse-item" variants={itemVariants}>
            <div className="pulse-header">
              <h3 className="pulse-title">BTC Dominance</h3>
            </div>
            <h4 className="pulse-value">
              {pulseData.btcDominance.value}%
            </h4>
            <div className={`pulse-trend ${pulseData.btcDominance.change > 0 ? 'positive' : 'negative'}`}>
              {pulseData.btcDominance.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(pulseData.btcDominance.change)}%
            </div>
            <div className="pulse-chart">
              {renderMiniChart(pulseData.btcDominance.chartData, '#f7931a', pulseData.btcDominance.change > 0)}
            </div>
          </motion.div>
          
          <motion.div className="pulse-item" variants={itemVariants}>
            <div className="pulse-header">
              <h3 className="pulse-title">Total Market Cap</h3>
            </div>
            <h4 className="pulse-value">
              ${pulseData.totalMarketCap.value}{pulseData.totalMarketCap.unit}
            </h4>
            <div className={`pulse-trend ${pulseData.totalMarketCap.change > 0 ? 'positive' : 'negative'}`}>
              {pulseData.totalMarketCap.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(pulseData.totalMarketCap.change)}%
            </div>
            <div className="pulse-chart">
              {renderMiniChart(pulseData.totalMarketCap.chartData, '#2196f3', pulseData.totalMarketCap.change > 0)}
            </div>
          </motion.div>
          
          <motion.div className="pulse-item" variants={itemVariants}>
            <div className="pulse-header">
              <h3 className="pulse-title">BTC Hash Rate</h3>
            </div>
            <h4 className="pulse-value">
              {pulseData.btcHashRate.value} {pulseData.btcHashRate.unit}
            </h4>
            <div className={`pulse-trend ${pulseData.btcHashRate.change > 0 ? 'positive' : 'negative'}`}>
              {pulseData.btcHashRate.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(pulseData.btcHashRate.change)}%
            </div>
            <div className="pulse-chart">
              {renderMiniChart(pulseData.btcHashRate.chartData, '#9c27b0', pulseData.btcHashRate.change > 0)}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MarketPulse;
