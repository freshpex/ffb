import { useEffect, useRef, useState } from 'react';
import { FaChartBar, FaBitcoin, FaEthereum, FaChartLine, FaChartPie, FaChartArea, FaExpand } from 'react-icons/fa';
import { SiLitecoin, SiRipple, SiDogecoin, SiCardano } from 'react-icons/si';
import { motion } from 'framer-motion';
import MarketDepthChart from './MarketDepthChart';
import LiveOrderbook from './LiveOrderbook';
import Loader from '../../common/Loader';

const AdvancedTradingView = () => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('60');
  const [chartType, setChartType] = useState('candlestick');
  const [showDepthChart, setShowDepthChart] = useState(false);
  const [showOrderbook, setShowOrderbook] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [error, setError] = useState(null);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize and manage TradingView widget
  useEffect(() => {
    // Skip if container ref is not available
    if (!containerRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Generate a unique ID for the container
      const containerId = `tradingview_advanced_${Math.random().toString(36).substring(2, 9)}`;
      containerRef.current.id = containerId;
      
      // Create the script
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            width: '100%',
            height: '100%',
            symbol: `BINANCE:${symbol}`,
            interval: timeframe,
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: chartType === 'candlestick' ? '1' : chartType === 'line' ? '2' : '3',
            locale: 'en',
            toolbar_bg: '#1F2937',
            enable_publishing: false,
            withdateranges: true,
            hide_side_toolbar: isMobile,
            hide_top_toolbar: isMobile,
            allow_symbol_change: true,
            studies: isMobile ? [] : ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies', 'MACD@tv-basicstudies'],
            save_image: !isMobile,
            container_id: containerId,
            loading_screen: { backgroundColor: "#131920", foregroundColor: "#9155fd" }
          });
          
          // Set a delay to ensure chart is loaded
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        }
      };
      
      script.onerror = () => {
        setError('Failed to load TradingView widget');
        setIsLoading(false);
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } catch (err) {
      console.error('TradingView widget error:', err);
      setError('Error initializing chart');
      setIsLoading(false);
    }
  }, [symbol, timeframe, chartType, isMobile]);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Available cryptocurrency symbols
  const cryptoSymbols = [
    { name: 'Bitcoin', symbol: 'BTCUSDT', icon: <FaBitcoin className="mr-2" /> },
    { name: 'Ethereum', symbol: 'ETHUSDT', icon: <FaEthereum className="mr-2" /> },
    { name: 'Litecoin', symbol: 'LTCUSDT', icon: <SiLitecoin className="mr-2" /> },
    { name: 'Ripple', symbol: 'XRPUSDT', icon: <SiRipple className="mr-2" /> },
    { name: 'Dogecoin', symbol: 'DOGEUSDT', icon: <SiDogecoin className="mr-2" /> },
    { name: 'Cardano', symbol: 'ADAUSDT', icon: <SiCardano className="mr-2" /> }
  ];

  // Available timeframes
  const timeframes = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '30m', value: '30' },
    { label: '1h', value: '60' },
    { label: '4h', value: '240' },
    { label: '1d', value: 'D' },
    { label: '1w', value: 'W' }
  ];

  // Available chart types
  const chartTypes = [
    { label: 'Candles', value: 'candlestick', icon: <FaChartBar /> },
    { label: 'Line', value: 'line', icon: <FaChartLine /> },
    { label: 'Area', value: 'area', icon: <FaChartArea /> }
  ];

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden bg-gray-900 ${fullscreen ? 'fixed inset-0 z-50' : 'relative'}`}>
      {/* Control panel */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
        {/* Symbol selector */}
        <div className="flex flex-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 gap-1 p-1">
          {cryptoSymbols.map((crypto) => (
            <motion.button
              key={crypto.symbol}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center whitespace-nowrap text-xs font-medium
                ${symbol === crypto.symbol 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              onClick={() => setSymbol(crypto.symbol)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {crypto.icon} {crypto.name}
            </motion.button>
          ))}
        </div>
        
        {/* Timeframe selector */}
        <div className="flex flex-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 gap-1 p-1 ml-auto">
          {timeframes.map((tf) => (
            <motion.button
              key={tf.value}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap text-xs font-medium
                ${timeframe === tf.value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              onClick={() => setTimeframe(tf.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {tf.label}
            </motion.button>
          ))}
        </div>
        
        {/* Chart type selector */}
        <div className="flex items-center gap-1 p-1">
          {chartTypes.map((type) => (
            <motion.button
              key={type.value}
              className={`p-2 rounded-md transition-colors
                ${chartType === type.value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              onClick={() => setChartType(type.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              title={type.label}
            >
              {type.icon}
            </motion.button>
          ))}
        </div>
        
        {/* Additional controls */}
        <div className="flex items-center gap-1 p-1 ml-2">
          <motion.button
            className={`p-2 rounded-md transition-colors
              ${showDepthChart 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            onClick={() => setShowDepthChart(!showDepthChart)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title="Market Depth"
          >
            <FaChartPie />
          </motion.button>
          
          <motion.button
            className={`p-2 rounded-md transition-colors
              ${showOrderbook 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            onClick={() => setShowOrderbook(!showOrderbook)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title="Orderbook"
          >
            <FaChartArea />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-md transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <FaExpand />
          </motion.button>
        </div>
      </div>
      
      {/* Main content area with chart and optional panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chart container */}
        <div className={`relative ${showOrderbook ? 'w-3/4' : 'w-full'} h-full`}>
          <div className={`relative ${showDepthChart ? 'h-2/3' : 'h-full'} w-full`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                <Loader fullScreen={false} size="small" text="Loading chart..." />
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 p-4">
                <div className="text-center">
                  <FaChartBar className="mx-auto text-4xl text-red-500 mb-2" />
                  <p className="text-red-400">{error}</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            <div 
              ref={containerRef}
              className="w-full h-full"
            />
          </div>
          
          {/* Market depth chart */}
          {showDepthChart && (
            <div className="h-1/3 w-full border-t border-gray-700">
              <MarketDepthChart symbol={symbol} />
            </div>
          )}
        </div>
        
        {/* Orderbook panel */}
        {showOrderbook && (
          <div className="w-1/4 h-full border-l border-gray-700 bg-gray-800">
            <LiveOrderbook symbol={symbol} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedTradingView;
