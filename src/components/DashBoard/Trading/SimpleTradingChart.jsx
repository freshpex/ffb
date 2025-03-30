import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCandlesticks, 
  selectSelectedAsset, 
  selectChartTimeframe,
  setChartTimeframe,
  fetchChartData,
} from '../../../redux/slices/tradingSlice';
import { FaChartLine, FaChartBar, FaChartArea, FaSpinner } from 'react-icons/fa';

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

const SimpleTradingChart = () => {
  const dispatch = useDispatch();
  const candlesticks = useSelector(selectCandlesticks);
  const selectedAsset = useSelector(selectSelectedAsset);
  const timeframe = useSelector(selectChartTimeframe);
  
  const canvasRef = useRef(null);
  const [chartType, setChartType] = useState('candles');
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
          setError('Failed to load chart data');
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [dispatch, selectedAsset, timeframe]);

  // Draw a simple chart visualization on canvas
  useEffect(() => {
    if (!canvasRef.current || !candlesticks || candlesticks.length === 0 || loading) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i < 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Find min and max prices for scaling
    let minPrice = Math.min(...candlesticks.map(c => c.low));
    let maxPrice = Math.max(...candlesticks.map(c => c.high));
    const priceRange = maxPrice - minPrice;
    
    // Add some padding
    minPrice -= priceRange * 0.05;
    maxPrice += priceRange * 0.05;

    // Draw candles or chart based on chart type
    const barWidth = width / (candlesticks.length + 1);
    const spacing = 2;
    
    if (chartType === 'candles' || chartType === 'bars') {
      // Draw candlestick chart
      for (let i = 0; i < candlesticks.length; i++) {
        const candle = candlesticks[i];
        const x = i * barWidth + spacing;

        // Scale prices to canvas height
        const open = height - ((candle.open - minPrice) / (maxPrice - minPrice)) * height;
        const close = height - ((candle.close - minPrice) / (maxPrice - minPrice)) * height;
        const high = height - ((candle.high - minPrice) / (maxPrice - minPrice)) * height;
        const low = height - ((candle.low - minPrice) / (maxPrice - minPrice)) * height;

        // Determine color based on price movement
        const isGreen = candle.close >= candle.open;
        ctx.fillStyle = isGreen ? '#48BB78' : '#F56565';
        ctx.strokeStyle = isGreen ? '#48BB78' : '#F56565';

        // Draw wick
        ctx.beginPath();
        ctx.moveTo(x + barWidth / 2, high);
        ctx.lineTo(x + barWidth / 2, low);
        ctx.stroke();

        // Draw body
        if (isGreen) {
          ctx.fillRect(x, close, barWidth - spacing * 2, open - close);
        } else {
          ctx.fillRect(x, open, barWidth - spacing * 2, close - open);
        }
      }
    } else if (chartType === 'line') {
      // Draw line chart
      ctx.beginPath();
      ctx.strokeStyle = '#4299E1';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < candlesticks.length; i++) {
        const candle = candlesticks[i];
        const x = i * barWidth + barWidth / 2;
        const y = height - ((candle.close - minPrice) / (maxPrice - minPrice)) * height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    } else if (chartType === 'area') {
      // Draw area chart
      ctx.beginPath();
      ctx.strokeStyle = '#4299E1';
      ctx.lineWidth = 2;
      
      // Starting point (bottom left)
      ctx.moveTo(barWidth / 2, height);
      
      // First price point
      const firstCandle = candlesticks[0];
      const firstY = height - ((firstCandle.close - minPrice) / (maxPrice - minPrice)) * height;
      ctx.lineTo(barWidth / 2, firstY);
      
      // Draw all price points
      for (let i = 1; i < candlesticks.length; i++) {
        const candle = candlesticks[i];
        const x = i * barWidth + barWidth / 2;
        const y = height - ((candle.close - minPrice) / (maxPrice - minPrice)) * height;
        ctx.lineTo(x, y);
      }
      
      // Close the path at the bottom right
      const lastX = (candlesticks.length - 1) * barWidth + barWidth / 2;
      ctx.lineTo(lastX, height);
      ctx.lineTo(barWidth / 2, height);
      
      // Fill gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(66, 153, 225, 0.6)');
      gradient.addColorStop(1, 'rgba(66, 153, 225, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fill();
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
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          width={800}
          height={400}
        />
      </div>
    </div>
  );
};

export default SimpleTradingChart;
