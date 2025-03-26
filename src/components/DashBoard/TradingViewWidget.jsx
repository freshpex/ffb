import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';

// Create TradingView widget component
function TradingViewWidget({ symbol = 'BTCUSDT', theme = 'dark', interval = '1D' }) {
  const container = useRef();
  
  // Convert crypto pair format from BTC/USDT to BTCUSDT for TradingView
  const formatSymbol = (symbolPair) => {
    // Handle cases like "BTC/USDT"
    if (symbolPair.includes('/')) {
      return symbolPair.replace('/', '');
    }
    return symbolPair;
  };

  useEffect(() => {
    // Clear existing widget if any
    if (container.current.hasChildNodes()) {
      container.current.innerHTML = '';
    }
    
    const formattedSymbol = formatSymbol(symbol);
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${formattedSymbol}`,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget',
          hide_side_toolbar: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies'
          ],
          disabled_features: [
            'use_localstorage_for_settings'
          ],
          enabled_features: [
            'study_templates'
          ],
        });
      }
    };
    
    container.current.appendChild(script);
    
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, theme, interval]);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div id="tradingview_widget" ref={container} style={{ height: 'calc(100% - 32px)', width: '100%' }} />
      <div className="tradingview-widget-copyright text-xs p-1 text-center text-gray-500">
        <a href="https://www.tradingview.com/" rel="noopener noreferrer" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

TradingViewWidget.propTypes = {
  symbol: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  interval: PropTypes.string
};

// Memoize component to prevent unnecessary re-renders
export default memo(TradingViewWidget);
