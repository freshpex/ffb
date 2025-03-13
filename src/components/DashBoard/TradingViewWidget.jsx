import { useEffect, useRef, useState } from 'react';
import { FaChartBar, FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin, SiRipple, SiDogecoin } from 'react-icons/si';
import { motion } from 'framer-motion';

const TradingViewWidget = () => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [symbol, setSymbol] = useState('BITSTAMP:BTCUSD');
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
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
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
  }, [scriptLoaded, symbol]);

  // Available cryptocurrency symbols
  const cryptoSymbols = [
    { name: 'Bitcoin', symbol: 'BITSTAMP:BTCUSD', icon: <FaBitcoin /> },
    { name: 'Ethereum', symbol: 'BITSTAMP:ETHUSD', icon: <FaEthereum /> },
    { name: 'Litecoin', symbol: 'BITSTAMP:LTCUSD', icon: <SiLitecoin /> },
    { name: 'Ripple', symbol: 'BITSTAMP:XRPUSD', icon: <SiRipple /> },
    { name: 'Dogecoin', symbol: 'BINANCE:DOGEUSD', icon: <SiDogecoin /> }
  ];

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div className="chart-symbol-selector">
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
      
      {isLoading && (
        <div className="chart-loading">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaChartBar size={30} />
          </motion.div>
          <span className="loading-text">Loading {symbol.split(':')[1]} chart...</span>
        </div>
      )}
      
      <div 
        ref={containerRef}
        style={{ 
          height: 'calc(100% - 50px)', 
          width: '100%',
          visibility: isLoading ? 'hidden' : 'visible'
        }} 
      />
    </div>
  );
};

export default TradingViewWidget;
