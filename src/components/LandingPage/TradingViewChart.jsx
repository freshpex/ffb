// TradingViewWidget.jsx

import { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function TradingViewChart() {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => onLoadScriptRef.current = null;

    function createWidget() {
      if (document.getElementById('tradingview_dd08c') && 'TradingView' in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "NASDAQ:AAPL",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          details: true,
          container_id: "tradingview_dd08c"
        });
      }
    }
  }, []);

  return (
    <div className="w-full h-[500px] bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div id="tradingview_dd08c" className="w-full h-[calc(100%-32px)]" />
      <div className="px-4 py-2 text-xs text-gray-400">
        <a 
          href="https://www.tradingview.com/" 
          rel="noopener nofollow noreferrer" 
          target="_blank"
          className="hover:text-primary-500 transition-colors"
        >
          <span className="text-primary-500">Track all markets on FFB</span>
        </a>
      </div>
    </div>
  );
}
