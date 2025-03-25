import { useEffect, useRef, useState } from 'react';
import { FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../common/Loader';

const TradingViewWidget = () => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [symbol, setSymbol] = useState('BTCUSDT');
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
      const containerId = `tradingview_${Math.random().toString(36).substring(2, 9)}`;
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
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            withdateranges: true,
            hide_side_toolbar: isMobile,
            hide_top_toolbar: isMobile,
            allow_symbol_change: true,
            studies: isMobile ? [] : ["MASimple@tv-basicstudies"],
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
  }, [symbol, isMobile]);

  // Crypto symbols available for selection
  const cryptoSymbols = [
    { symbol: 'BTCUSDT', name: 'Bitcoin' },
    { symbol: 'ETHUSDT', name: 'Ethereum' },
    { symbol: 'LTCUSDT', name: 'Litecoin' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin' },
    { symbol: 'SOLUSDT', name: 'Solana' }
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-900">
      {/* Symbol selector */}
      <div className="flex overflow-x-auto p-2 space-x-2 bg-gray-800 border-b border-gray-700 scrollbar-thin scrollbar-thumb-gray-600">
        {cryptoSymbols.map((crypto) => (
          <button
            key={crypto.symbol}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap text-sm font-medium 
              ${symbol === crypto.symbol 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            onClick={() => setSymbol(crypto.symbol)}
          >
            {crypto.name}
          </button>
        ))}
      </div>
      
      {/* Chart container */}
      <div className="relative w-full" style={{ height: 'calc(100% - 48px)' }}>
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
    </div>
  );
};

export default TradingViewWidget;
