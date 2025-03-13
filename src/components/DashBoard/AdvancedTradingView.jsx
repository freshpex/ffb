import { useEffect, useRef, useState } from 'react';
import { FaChartBar, FaBitcoin, FaEthereum, FaChartLine, FaChartPie, FaChartArea, FaExpand } from 'react-icons/fa';
import { SiLitecoin, SiRipple, SiDogecoin, SiCardano } from 'react-icons/si';
import { motion } from 'framer-motion';
import MarketDepthChart from './MarketDepthChart';
import LiveOrderbook from './LiveOrderbook';

const AdvancedTradingView = () => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [chartType, setChartType] = useState('candlestick');
  const [showDepthChart, setShowDepthChart] = useState(false);
  const [showOrderbook, setShowOrderbook] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  
  const chartLoadedRef = useRef(false);

  useEffect(() => {
    // Check if TradingView object already exists to avoid re-loading
    if (window.TradingView) {
      setScriptLoaded(true);
      return;
    }

    // Load TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    setIsLoading(true);
    chartLoadedRef.current = false;

    // Clean up any existing chart
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Generate a unique ID for the container
    const containerId = 'tradingview_widget_' + Math.random().toString(36).substring(2, 9);
    containerRef.current.id = containerId;

    const widgetOptions = {
      width: '100%',
      height: '100%',
      symbol: `BINANCE:${symbol}`,
      interval: timeframe,
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: chartType === 'candlestick' ? '1' : chartType === 'line' ? '2' : '3',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      studies: ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies', 'MACD@tv-basicstudies'],
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '650',
      save_image: true,
      container_id: containerId,
      hide_top_toolbar: false,
      loading_screen: { backgroundColor: "#131920", foregroundColor: "#f9a23f" }
    };

    const widget = new window.TradingView.widget(widgetOptions);

    // Use event listener for widget loading completion instead of onChartReady
    const handleIframeLoad = () => {
      // Find the iframe created by TradingView
      const iframes = containerRef.current?.getElementsByTagName('iframe');
      if (iframes && iframes.length > 0) {
        if (!chartLoadedRef.current) {
          setIsLoading(false);
          chartLoadedRef.current = true;
        }
      }
    };

    // Monitor for the iframe to be created and loaded
    const checkIframe = setInterval(() => {
      if (!containerRef.current) {
        clearInterval(checkIframe);
        return;
      }
      
      const iframes = containerRef.current.getElementsByTagName('iframe');
      if (iframes.length > 0) {
        // Add load event listener
        iframes[0].addEventListener('load', handleIframeLoad);
        
        // Also check if it's already loaded
        if (iframes[0].contentDocument && 
            iframes[0].contentDocument.readyState === 'complete') {
          handleIframeLoad();
        }
        
        clearInterval(checkIframe);
      }
    }, 100);

    // Backup timeout in case iframe detection doesn't work
    const backupTimeout = setTimeout(() => {
      if (isLoading && containerRef.current) {
        setIsLoading(false);
      }
    }, 5000);

    // Clear interval and timeout on cleanup
    return () => {
      clearInterval(checkIframe);
      clearTimeout(backupTimeout);
    };
  }, [scriptLoaded, symbol, timeframe, chartType]);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Available cryptocurrency symbols
  const cryptoSymbols = [
    { name: 'Bitcoin', symbol: 'BTCUSDT', icon: <FaBitcoin /> },
    { name: 'Ethereum', symbol: 'ETHUSDT', icon: <FaEthereum /> },
    { name: 'Litecoin', symbol: 'LTCUSDT', icon: <SiLitecoin /> },
    { name: 'Ripple', symbol: 'XRPUSDT', icon: <SiRipple /> },
    { name: 'Dogecoin', symbol: 'DOGEUSDT', icon: <SiDogecoin /> },
    { name: 'Cardano', symbol: 'ADAUSDT', icon: <SiCardano /> }
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
    <div className={`advanced-tradingview-container ${fullscreen ? 'fullscreen' : ''}`}>
      <div className="tradingview-controls">
        <div className="control-group symbols">
          {cryptoSymbols.map(crypto => (
            <motion.button
              key={crypto.symbol}
              className={`symbol-button ${symbol === crypto.symbol ? 'active' : ''}`}
              onClick={() => setSymbol(crypto.symbol)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {crypto.icon} <span className="symbol-name">{crypto.name}</span>
            </motion.button>
          ))}
        </div>
        
        <div className="control-group timeframes">
          {timeframes.map(tf => (
            <motion.button
              key={tf.value}
              className={`timeframe-button ${timeframe === tf.value ? 'active' : ''}`}
              onClick={() => setTimeframe(tf.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tf.label}
            </motion.button>
          ))}
        </div>
        
        <div className="control-group chart-types">
          {chartTypes.map(type => (
            <motion.button
              key={type.value}
              className={`chart-type-button ${chartType === type.value ? 'active' : ''}`}
              onClick={() => setChartType(type.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={type.label}
            >
              {type.icon}
            </motion.button>
          ))}
        </div>
        
        <div className="control-group additional">
          <motion.button
            className={`depth-button ${showDepthChart ? 'active' : ''}`}
            onClick={() => setShowDepthChart(!showDepthChart)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Market Depth"
          >
            <FaChartPie />
          </motion.button>
          
          <motion.button
            className={`orderbook-button ${showOrderbook ? 'active' : ''}`}
            onClick={() => setShowOrderbook(!showOrderbook)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Orderbook"
          >
            <FaChartArea />
          </motion.button>
          
          <motion.button
            className="fullscreen-button"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <FaExpand />
          </motion.button>
        </div>
      </div>
      
      <div className="chart-container-wrapper">
        <div className="chart-container">
          {isLoading && (
            <div className="chart-loading">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <FaChartBar size={30} />
              </motion.div>
              <span className="loading-text">Loading {symbol} chart...</span>
            </div>
          )}
          
          <div 
            ref={containerRef}
            style={{ 
              height: '100%', 
              width: '100%',
              visibility: isLoading ? 'hidden' : 'visible'
            }} 
          />
        </div>
        
        {showDepthChart && (
          <div className="market-depth-container">
            <MarketDepthChart symbol={symbol} />
          </div>
        )}
      </div>
      
      {showOrderbook && (
        <div className="orderbook-container">
          <LiveOrderbook symbol={symbol} />
        </div>
      )}
    </div>
  );
};

export default AdvancedTradingView;
