import { useEffect, useRef, useState } from 'react';

function TradingViewWidget() {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const widgetInitializedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Only run this effect if widget is not already initialized
    if (!containerRef.current || widgetInitializedRef.current) return;
    
    // Create a container div with a specific ID
    const containerId = `tradingview_ticker_${Math.random().toString(36).substring(2, 9)}`;
    
    // Set the ID directly on the ref element
    containerRef.current.id = containerId;
    
    // Create the script element
    scriptRef.current = document.createElement("script");
    scriptRef.current.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    scriptRef.current.type = "text/javascript";
    scriptRef.current.async = true;
    
    // Default config for desktop
    let widgetConfig = {
      symbols: [
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500"
        },
        {
          proName: "FOREXCOM:NSXUSD",
          title: "US 100"
        },
        {
          proName: "FX_IDC:EURUSD",
          title: "EUR/USD"
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin"
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum"
        }
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
      container_id: containerId
    };
    
    // Mobile specific adjustments
    if (isMobile) {
      widgetConfig.showSymbolLogo = false; // Hide logos on mobile
      widgetConfig.displayMode = "regular"; // Regular display mode for stability
    }
    
    scriptRef.current.innerHTML = JSON.stringify(widgetConfig);
    
    // Append the script to the container
    containerRef.current.appendChild(scriptRef.current);
    
    // Mark as initialized using ref instead of state to avoid re-renders
    widgetInitializedRef.current = true;
    
    // Cleanup function
    return () => {
      if (containerRef.current && scriptRef.current && containerRef.current.contains(scriptRef.current)) {
        containerRef.current.removeChild(scriptRef.current);
      }
      widgetInitializedRef.current = false;
    };
  }, [isMobile]); // Only depend on isMobile, not on widgetInitialized state

  return (
    <div 
      className="relative z-[5] mt-2.5 w-full h-10 overflow-hidden pointer-events-auto isolate transform-gpu bg-[#131722]"
      ref={containerRef}
    />
  );
}

export default TradingViewWidget;
