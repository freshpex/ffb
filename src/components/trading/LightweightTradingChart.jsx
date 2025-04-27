import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createChart } from "lightweight-charts";
import {
  selectCandlesticks,
  selectSelectedAsset,
  selectChartTimeframe,
  setChartTimeframe,
  fetchChartData,
} from "../../redux/slices/tradingSlice";
import {
  FaChartLine,
  FaChartBar,
  FaChartArea,
  FaSpinner,
} from "react-icons/fa";

const TIMEFRAMES = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "30m", label: "30m" },
  { value: "1h", label: "1h" },
  { value: "4h", label: "4h" },
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
];

const LightweightTradingChart = () => {
  const dispatch = useDispatch();
  const candlesticks = useSelector(selectCandlesticks);
  const selectedAsset = useSelector(selectSelectedAsset);
  const timeframe = useSelector(selectChartTimeframe);

  const chartContainerRef = useRef(null);
  const chart = useRef(null);
  const series = useRef(null);

  const [chartType, setChartType] = useState("candles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when selected asset or timeframe changes
  useEffect(() => {
    const fetchData = async () => {
      if (selectedAsset && timeframe) {
        setLoading(true);
        setError(null);

        try {
          await dispatch(fetchChartData({ symbol: selectedAsset, timeframe }));
          setLoading(false);
        } catch (err) {
          setError("Failed to load chart data");
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, selectedAsset, timeframe]);

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      // Clean up previous chart
      if (chart.current) {
        chart.current.remove();
        chart.current = null;
        series.current = null;
      }

      try {
        // Create a simple chart
        const newChart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 500,
          layout: {
            background: { type: "solid", color: "#1A202C" },
            textColor: "#D9D9D9",
          },
          grid: {
            vertLines: { color: "#2D3748" },
            horzLines: { color: "#2D3748" },
          },
          timeScale: {
            borderColor: "#4A5568",
            timeVisible: true,
          },
        });

        chart.current = newChart;

        // Handle window resize
        const handleResize = () => {
          if (chart.current && chartContainerRef.current) {
            chart.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
            });
          }
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (chart.current) {
            chart.current.remove();
            chart.current = null;
          }
        };
      } catch (err) {
        console.error("Error initializing chart:", err);
        setError("Failed to initialize chart");
      }
    }
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (!chart.current || !candlesticks || candlesticks.length === 0 || loading)
      return;

    try {
      // Remove existing series
      if (series.current) {
        chart.current.removeSeries(series.current);
        series.current = null;
      }

      // Create series based on chart type
      let newSeries;

      switch (chartType) {
        case "line":
          newSeries = chart.current.addLineSeries({
            color: "#4299E1",
            lineWidth: 2,
          });
          break;
        case "area":
          newSeries = chart.current.addAreaSeries({
            topColor: "rgba(66, 153, 225, 0.6)",
            bottomColor: "rgba(66, 153, 225, 0.1)",
            lineColor: "#4299E1",
            lineWidth: 2,
          });
          break;
        case "candles":
        default:
          newSeries = chart.current.addCandlestickSeries({
            upColor: "#48BB78",
            downColor: "#F56565",
            borderUpColor: "#48BB78",
            borderDownColor: "#F56565",
            wickUpColor: "#48BB78",
            wickDownColor: "#F56565",
          });
          break;
      }

      series.current = newSeries;

      // Format data for the series
      const formattedData = candlesticks.map((candle) => {
        if (chartType === "line" || chartType === "area") {
          return {
            time: candle.time,
            value: candle.close,
          };
        } else {
          return {
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          };
        }
      });

      // Set the data
      series.current.setData(formattedData);

      // Fit content
      chart.current.timeScale().fitContent();
    } catch (err) {
      console.error("Error updating chart:", err);
      setError("Failed to update chart");
    }
  }, [candlesticks, chartType, loading]);

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    dispatch(setChartTimeframe(newTimeframe));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chart toolbar */}
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        {/* Chart type selection */}
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded ${chartType === "candles" ? "bg-gray-700 text-primary-500" : "text-gray-400 hover:text-white"}`}
            onClick={() => setChartType("candles")}
            title="Candlestick"
          >
            <FaChartBar />
          </button>
          <button
            className={`p-2 rounded ${chartType === "line" ? "bg-gray-700 text-primary-500" : "text-gray-400 hover:text-white"}`}
            onClick={() => setChartType("line")}
            title="Line"
          >
            <FaChartLine />
          </button>
          <button
            className={`p-2 rounded ${chartType === "area" ? "bg-gray-700 text-primary-500" : "text-gray-400 hover:text-white"}`}
            onClick={() => setChartType("area")}
            title="Area"
          >
            <FaChartArea />
          </button>
        </div>

        {/* Timeframe selection */}
        <div className="flex">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              className={`px-2 py-1 text-xs font-medium rounded ${
                timeframe === tf.value
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleTimeframeChange(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="flex-grow relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
            <FaSpinner className="animate-spin text-primary-500" size={30} />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
            <div className="bg-red-900/80 text-white px-4 py-2 rounded">
              {error}
            </div>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default LightweightTradingChart;
