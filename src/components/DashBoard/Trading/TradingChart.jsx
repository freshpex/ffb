import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createChart,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries
} from 'lightweight-charts';
import { 
  selectCandlesticks, 
  selectSelectedAsset, 
  selectChartTimeframe,
  setChartTimeframe,
  fetchChartData,
  toggleChartIndicator,
  selectChartIndicators
} from '../../../redux/slices/tradingSlice';
import { FaCog, FaChartLine, FaChartBar, FaChartArea, FaSpinner } from 'react-icons/fa';

const TIMEFRAMES = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
];

const TradingChart = () => {
  const dispatch = useDispatch();
  const candlesticks = useSelector(selectCandlesticks);
  const selectedAsset = useSelector(selectSelectedAsset);
  const timeframe = useSelector(selectChartTimeframe);
  const indicators = useSelector(selectChartIndicators);
  
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  
  const [chartType, setChartType] = useState('candles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
        candlestickSeriesRef.current = null;
        indicatorSeriesRef.current = {};
      }
      
      try {
        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 500,
          layout: {
            background: { type: 'solid', color: '#1A202C' },
            textColor: '#D9D9D9',
          },
          grid: {
            vertLines: { color: '#2D3748' },
            horzLines: { color: '#2D3748' },
          },
          crosshair: {
            mode: 0,
          },
          priceScale: {
            borderColor: '#4A5568',
          },
          timeScale: {
            borderColor: '#4A5568',
            timeVisible: true,
          },
        });
        
        chartInstanceRef.current = chart;
      } catch (err) {
        console.error("Failed to create chart:", err);
        setError("Failed to initialize chart component");
      }
      
      // Handle window resize
      const handleResize = () => {
        if (chartInstanceRef.current && chartContainerRef.current) {
          chartInstanceRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstanceRef.current) {
          chartInstanceRef.current.remove();
          chartInstanceRef.current = null;
        }
      };
    }
  }, []);
  
  useEffect(() => {
    if (!chartInstanceRef.current || !candlesticks || candlesticks.length === 0) {
      return;
    }
    
    try {
      // Remove existing series
      if (candlestickSeriesRef.current) {
        chartInstanceRef.current.removeSeries(candlestickSeriesRef.current);
        candlestickSeriesRef.current = null;
      }
      
      // Create new series based on chart type
      let newSeries;
      switch (chartType) {
        case 'candles':
          newSeries = new CandlestickSeries({
            upColor: '#48BB78',
            downColor: '#F56565',
            borderUpColor: '#48BB78',
            borderDownColor: '#F56565',
            wickUpColor: '#48BB78',
            wickDownColor: '#F56565',
          });
          break;
        case 'line':
          newSeries = new LineSeries({
            color: '#4299E1',
            lineWidth: 2,
            priceLineVisible: false,
          });
          break;
        case 'area':
          newSeries = new AreaSeries({
            topColor: 'rgba(66, 153, 225, 0.6)',
            bottomColor: 'rgba(66, 153, 225, 0.1)',
            lineColor: '#4299E1',
            lineWidth: 2,
          });
          break;
        case 'bars':
          newSeries = new CandlestickSeries({
            upColor: '#48BB78',
            downColor: '#F56565',
          });
          break;
        default:
          newSeries = new CandlestickSeries({
            upColor: '#48BB78',
            downColor: '#F56565',
            borderUpColor: '#48BB78',
            borderDownColor: '#F56565',
            wickUpColor: '#48BB78',
            wickDownColor: '#F56565',
          });
      }
      
      // Add series to chart
      chartInstanceRef.current.addSeries(newSeries);
      
      // Save reference to series
      candlestickSeriesRef.current = newSeries;
      
      // Format data based on chart type
      let formattedData;
      if (chartType === 'candles' || chartType === 'bars') {
        // For candlestick and bar charts, ensure proper data format
        formattedData = candlesticks.map(candle => ({
          time: candle.time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close
        }));
      } else {
        // For line and area charts, we only need close prices
        formattedData = candlesticks.map(candle => ({
          time: candle.time,
          value: candle.close,
        }));
      }
      
      // Set data to series
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(formattedData);
      
        // Fit content
        chartInstanceRef.current.timeScale().fitContent();
      
        // Update indicators
        updateIndicators();
      }
    } catch (err) {
      console.error("Error updating chart series:", err);
      setError("Failed to update chart data");
    }
  }, [chartType, candlesticks]);
  
  // Update data when selected asset or timeframe changes
  useEffect(() => {
    const fetchData = async () => {
      if (selectedAsset && timeframe) {
        setLoading(true);
        setError(null);
        
        try {
          await dispatch(fetchChartData({ symbol: selectedAsset, timeframe }));
          setLoading(false);
        } catch (err) {
          setError('Failed to load chart data');
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [dispatch, selectedAsset, timeframe]);
  
  // Function to update indicators
  const updateIndicators = () => {
    try {
      // Clear existing indicators
      Object.values(indicatorSeriesRef.current).forEach(series => {
        if (chartInstanceRef.current && series) {
          chartInstanceRef.current.removeSeries(series);
        }
      });
      indicatorSeriesRef.current = {};
      
      // Add active indicators
      if (chartInstanceRef.current && candlestickSeriesRef.current && 
          candlesticks && candlesticks.length > 0) {
        // Simple Moving Averages
        if (indicators.sma) {
          const sma20Data = calculateSMA(candlesticks, 20);
          const sma50Data = calculateSMA(candlesticks, 50);
          
          const sma20Series = new LineSeries({
            color: '#38B2AC',
            lineWidth: 1,
            title: 'SMA 20',
          });
          chartInstanceRef.current.addSeries(sma20Series);
          sma20Series.setData(sma20Data);
          indicatorSeriesRef.current.sma20 = sma20Series;
          
          const sma50Series = new LineSeries({
            color: '#805AD5',
            lineWidth: 1,
            title: 'SMA 50',
          });
          chartInstanceRef.current.addSeries(sma50Series);
          sma50Series.setData(sma50Data);
          indicatorSeriesRef.current.sma50 = sma50Series;
        }
        
        // Volume indicator
        if (indicators.volume && chartType === 'candles') {
          const volumeSeries = new HistogramSeries({
            color: '#4A5568',
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
          });
          chartInstanceRef.current.addSeries(volumeSeries);
          
          const volumeData = candlesticks.map(candle => ({
            time: candle.time,
            value: candle.volume,
            color: candle.close >= candle.open ? 'rgba(72, 187, 120, 0.5)' : 'rgba(245, 101, 101, 0.5)',
          }));
          
          volumeSeries.setData(volumeData);
          indicatorSeriesRef.current.volume = volumeSeries;
        }
      }
    } catch (err) {
      console.error("Error updating indicators:", err);
    }
  };
  
  // Helper function to calculate Simple Moving Average
  const calculateSMA = (data, period) => {
    const result = [];
    
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      const value = sum / period;
      
      result.push({
        time: data[i].time,
        value: value,
      });
    }
    
    return result;
  };
  
  // Toggle chart indicator
  const handleToggleIndicator = (indicator) => {
    dispatch(toggleChartIndicator(indicator));
  };
  
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
            className={`p-2 rounded ${chartType === 'candles' ? 'bg-gray-700 text-primary-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setChartType('candles')}
            title="Candlestick"
          >
            <FaChartBar />
          </button>
          <button
            className={`p-2 rounded ${chartType === 'line' ? 'bg-gray-700 text-primary-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setChartType('line')}
            title="Line"
          >
            <FaChartLine />
          </button>
          <button
            className={`p-2 rounded ${chartType === 'area' ? 'bg-gray-700 text-primary-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setChartType('area')}
            title="Area"
          >
            <FaChartArea />
          </button>
          
          <div className="mx-2 h-5 border-l border-gray-600"></div>
          
          {/* Indicators */}
          <div className="relative group">
            <button
              className="p-2 rounded text-gray-400 hover:text-white"
              title="Indicators"
            >
              <FaCog />
            </button>
            <div className="absolute left-0 mt-1 w-48 bg-gray-800 rounded shadow-lg border border-gray-700 hidden group-hover:block z-10">
              <div className="p-2">
                <div className="px-3 py-2 text-sm text-gray-300 font-medium">Indicators</div>
                <div className="p-2 space-y-2">
                  <label className="flex items-center text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={indicators.sma}
                      onChange={() => handleToggleIndicator('sma')}
                      className="mr-2"
                    />
                    Moving Averages
                  </label>
                  <label className="flex items-center text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={indicators.volume}
                      onChange={() => handleToggleIndicator('volume')}
                      className="mr-2"
                    />
                    Volume
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeframe selection */}
        <div className="flex">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              className={`px-2 py-1 text-xs font-medium rounded ${
                timeframe === tf.value
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
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

export default TradingChart;
