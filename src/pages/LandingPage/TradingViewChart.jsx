import { useEffect, useRef, useState } from "react";
import { FaSync, FaExternalLinkAlt } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const TradingViewChart = () => {
  const { darkMode } = useDarkMode();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Clean up any existing scripts
    const existingScript = document.getElementById("tradingview-widget-script");
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script
    const script = document.createElement("script");
    script.id = "tradingview-widget-script";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "Etc/UTC",
      theme: darkMode ? "dark" : "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    // Add error handling
    script.onerror = () => {
      setError(true);
      setLoading(false);
    };

    // Load script
    if (containerRef.current) {
      containerRef.current.appendChild(script);

      // Set loading to false after a delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
        if (containerRef.current && script) {
          try {
            containerRef.current.removeChild(script);
          } catch (e) {
            console.error("Error removing TradingView script:", e);
          }
        }
      };
    }
  }, [darkMode]);

  return (
    <section className={`py-12 px-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4 md:mb-0`}
          >
            Live Market Overview
          </h2>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className={`flex items-center ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-lg transition-colors`}
            >
              <FaSync className="mr-2" /> Refresh
            </button>

            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center ${
                darkMode
                  ? "bg-primary-700 hover:bg-primary-800 text-white"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              } px-4 py-2 rounded-lg transition-colors`}
            >
              <FaExternalLinkAlt className="mr-2" /> Full View
            </a>
          </div>
        </div>

        <div className="relative">
          {loading && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg z-10`}
            >
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Loading chart data...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg z-10`}
            >
              <div className="flex flex-col items-center text-center px-4">
                <svg
                  className="w-16 h-16 text-red-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-4`}
                >
                  Failed to load TradingView chart.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className={`tradingview-widget-container ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200 shadow-lg"
            } rounded-lg overflow-hidden`}
            style={{ height: "600px" }}
          >
            <div
              className="tradingview-widget-container__widget"
              style={{ height: "100%", width: "100%" }}
            ></div>
          </div>
        </div>

        <p
          className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} text-center`}
        >
          Powered by TradingView. Charts are for illustrative purposes only.
        </p>
      </div>
    </section>
  );
};

export default TradingViewChart;
