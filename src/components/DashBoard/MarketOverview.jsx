import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBitcoin, FaEthereum, FaArrowUp, FaArrowDown, FaChartLine, FaSpinner } from 'react-icons/fa';
import { SiLitecoin, SiRipple, SiDogecoin } from 'react-icons/si';
import axios from 'axios';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIconForCoin = (id) => {
    switch (id) {
      case 'bitcoin': return <FaBitcoin />;
      case 'ethereum': return <FaEthereum />;
      case 'litecoin': return <SiLitecoin />;
      case 'ripple':
      case 'xrp': return <SiRipple />;
      case 'dogecoin': return <SiDogecoin />;
      default: return <FaChartLine />;
    }
  };

  const getColorForCoin = (id) => {
    switch (id) {
      case 'bitcoin': return '#f7931a';
      case 'ethereum': return '#627eea';
      case 'litecoin': return '#345d9d';
      case 'ripple':
      case 'xrp': return '#0091e6';
      case 'dogecoin': return '#c2a633';
      default: return '#9155fd';
    }
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data to avoid API rate limits during development then switch back too https://api.coingecko.com/api/v3/coins/markets
        const mockData = [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 64352.12,
            change: 2.45,
            chartData: [62000, 63100, 62500, 64000, 64500, 64352],
            color: '#f7931a'
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            price: 3450.78,
            change: -1.23,
            chartData: [3500, 3480, 3400, 3350, 3420, 3450],
            color: '#627eea'
          },
          {
            id: 'litecoin',
            name: 'Litecoin',
            symbol: 'LTC',
            price: 78.34,
            change: 0.95,
            chartData: [77, 77.5, 76.8, 78.1, 78.5, 78.34],
            color: '#345d9d'
          },
          {
            id: 'ripple',
            name: 'Ripple',
            symbol: 'XRP',
            price: 0.58,
            change: -0.33,
            chartData: [0.59, 0.585, 0.58, 0.575, 0.579, 0.58],
            color: '#0091e6'
          },
          {
            id: 'dogecoin',
            name: 'Dogecoin',
            symbol: 'DOGE',
            price: 0.12,
            change: 5.67,
            chartData: [0.11, 0.114, 0.118, 0.121, 0.122, 0.12],
            color: '#c2a633'
          }
        ];
        
        setMarketData(mockData);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to load market data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);
  
  // Mini chart rendering function
  const renderMiniChart = (data, color, isPositive) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
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

  if (isLoading) {
    return (
      <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <FaSpinner size={30} className="text-primary-500" />
        </motion.div>
        <p className="text-gray-300">Loading market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center h-64">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <motion.h2 
          className="text-xl font-bold text-white flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaChartLine className="mr-2 text-primary-500" /> Market Overview
        </motion.h2>
      </div>
      
      <div className="p-6">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {marketData.map((coin) => (
            <motion.div 
              key={coin.id}
              className="bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${coin.color}20`, color: coin.color }}>
                  {getIconForCoin(coin.id)}
                </div>
                <div>
                  <h3 className="font-bold text-white">{coin.name}</h3>
                  <span className="text-xs text-gray-400">{coin.symbol}</span>
                </div>
              </div>
              
              <div className="text-xl font-bold text-white mb-1">
                ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
              </div>
              
              <div className={`flex items-center text-sm mb-3 ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.change >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(coin.change).toFixed(2)}%
              </div>
              
              <div className="h-16 w-full">
                {renderMiniChart(coin.chartData, coin.color, coin.change >= 0)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarketOverview;
