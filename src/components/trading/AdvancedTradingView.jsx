import { useEffect, useRef, useState } from "react";
import {
  FaChartBar,
  FaBitcoin,
  FaEthereum,
  FaChartLine,
  FaChartPie,
  FaChartArea,
  FaExpand,
} from "react-icons/fa";
import { SiLitecoin, SiRipple, SiDogecoin, SiCardano } from "react-icons/si";
import { motion } from "framer-motion";
import MarketDepthChart from "./MarketDepthChart";
import LiveOrderbook from "./LiveOrderbook";
import Loader from "../common/Loader";

const AdvancedTradingView = () => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("60");
  const [chartType, setChartType] = useState("candlestick");
  const [showDepthChart, setShowDepthChart] = useState(false);
  const [showOrderbook, setShowOrderbook] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Create TradingView widget
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = initWidget;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, timeframe, chartType]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Initialize TradingView widget
  const initWidget = () => {
    if (!containerRef.current) return;

    setIsLoading(true);
    containerRef.current.innerHTML = "";

    const config = {
      autosize: true,
      symbol: symbol,
      interval: timeframe,
      timezone: "Etc/UTC",
      theme: "dark",
      style: chartType,
      locale: "en",
      toolbar_bg: "#131722",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      container_id: containerRef.current.id,
      disabled_features: [
        "header_symbol_search",
        "header_saveload",
        "header_screenshot",
      ],
      enabled_features: [
        "use_localstorage_for_settings",
        "volume_force_overlay",
      ],
    };

    // eslint-disable-next-line no-undef
    const widget = new TradingView.widget(config);

    widget.onChartReady(() => {
      setIsLoading(false);
    });
  };

  // Handle symbol change
  const handleSymbolChange = (newSymbol) => {
    setSymbol(newSymbol);
    setIsLoading(true);
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setIsLoading(true);
  };

  // Toggle chart type
  const handleChartTypeChange = (newType) => {
    setChartType(newType);
    setIsLoading(true);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Toggle depth chart
  const toggleDepthChart = () => {
    setShowDepthChart(!showDepthChart);
    if (showOrderbook && !showDepthChart) {
      setShowOrderbook(false);
    }
  };

  // Toggle orderbook
  const toggleOrderbook = () => {
    setShowOrderbook(!showOrderbook);
    if (showDepthChart && !showOrderbook) {
      setShowDepthChart(false);
    }
  };

  // Available cryptocurrency symbols
  const availableSymbols = [
    { symbol: "BTCUSDT", name: "Bitcoin", icon: <FaBitcoin /> },
    { symbol: "ETHUSDT", name: "Ethereum", icon: <FaEthereum /> },
    { symbol: "LTCUSDT", name: "Litecoin", icon: <SiLitecoin /> },
    { symbol: "XRPUSDT", name: "Ripple", icon: <SiRipple /> },
    { symbol: "DOGEUSDT", name: "Dogecoin", icon: <SiDogecoin /> },
    { symbol: "ADAUSDT", name: "Cardano", icon: <SiCardano /> },
  ];

  // Timeframe options
  const timeframeOptions = [
    { value: "1", label: "1m" },
    { value: "5", label: "5m" },
    { value: "15", label: "15m" },
    { value: "30", label: "30m" },
    { value: "60", label: "1h" },
    { value: "240", label: "4h" },
    { value: "D", label: "1D" },
    { value: "W", label: "1W" },
  ];

  // Chart type options
  const chartTypeOptions = [
    { value: "candlestick", label: "Candlestick", icon: <FaChartBar /> },
    { value: "line", label: "Line", icon: <FaChartLine /> },
    { value: "area", label: "Area", icon: <FaChartArea /> },
    { value: "bars", label: "Bars", icon: <FaChartPie /> },
  ];

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      {/* Chart toolbar */}
      <div className="p-4 border-b border-gray-800 flex flex-wrap items-center gap-4">
        {/* Symbol selector */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Symbol:</span>
          <select
            value={symbol}
            onChange={(e) => handleSymbolChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md text-white py-1 px-2"
          >
            {availableSymbols.map((option) => (
              <option key={option.symbol} value={option.symbol}>
                {option.name} ({option.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Interval:</span>
          <div className="flex bg-gray-800 rounded-lg border border-gray-700">
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTimeframeChange(option.value)}
                className={`py-1 px-3 text-xs font-medium ${
                  timeframe === option.value
                    ? "bg-blue-600 text-white rounded-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart type selector */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Type:</span>
          <div className="flex bg-gray-800 rounded-lg border border-gray-700">
            {chartTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChartTypeChange(option.value)}
                title={option.label}
                className={`p-2 ${
                  chartType === option.value
                    ? "text-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {/* Toggle depth chart button */}
          <button
            onClick={toggleDepthChart}
            className={`p-2 rounded-lg text-sm ${
              showDepthChart
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
            title="Market Depth"
          >
            Depth Chart
          </button>

          {/* Toggle orderbook button */}
          <button
            onClick={toggleOrderbook}
            className={`p-2 rounded-lg text-sm ${
              showOrderbook
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
            title="Order Book"
          >
            Orderbook
          </button>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
            title="Fullscreen"
          >
            <FaExpand />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4">
        {/* TradingView chart */}
        <div
          className={`${showDepthChart || showOrderbook ? "lg:col-span-3" : "lg:col-span-4"} h-full min-h-[500px] relative`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
              <Loader />
            </div>
          )}
          <div
            ref={containerRef}
            id="tradingview_widget_container"
            className="w-full h-full"
          />
        </div>

        {/* Side panels */}
        {(showDepthChart || showOrderbook) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1 border-l border-gray-800 min-h-[500px] h-full"
          >
            {showDepthChart && <MarketDepthChart symbol={symbol} />}
            {showOrderbook && <LiveOrderbook symbol={symbol} />}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedTradingView;
