import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

// A simple wrapper around the TradingView Advanced Chart widget
const TradingViewWidget = ({ symbol }) => {
  const container = useRef();

  const safeSymbol = symbol || "BTC/USD";

  useEffect(() => {
    // Clear previous widget if it exists
    if (container.current) {
      container.current.innerHTML = "";
    }

    // Create the script element for TradingView widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== "undefined" && container.current) {
        const formattedSymbol = safeSymbol.replace("/", "");

        // eslint-disable-next-line no-new
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${formattedSymbol}`,
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1A202C",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          hide_side_toolbar: false,
          backgroundColor: "#1A202C",
          gridColor: "#2D3748",
          hide_volume: false,
        });
      }
    };
    container.current.appendChild(script);

    return () => {
      // Cleanup
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [safeSymbol]);

  return (
    <div className="w-full h-full bg-gray-800">
      <div
        id={`tradingview_widget_${Math.floor(Math.random() * 1000000)}`}
        ref={container}
        className="h-full"
      />
    </div>
  );
};

TradingViewWidget.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default TradingViewWidget;
