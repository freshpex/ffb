import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectSelectedAsset,
  setChartTimeframe,
  selectChartTimeframe
} from '../../../redux/slices/tradingSlice';
import { createChart, CrosshairMode } from 'lightweight-charts';

const TIMEFRAMES = [
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' }
];

const generateMockCandlestickData = (symbol, timeframe, count = 200) => {
  const data = [];
  let basePrice;
  
  // Set base price based on symbol
  if (symbol.includes('BTC')) {
    basePrice = 65000;
  } else if (symbol.includes('ETH')) {
    basePrice = 3450;
  } else if (symbol.includes('LTC')) {
    basePrice = 78;
  } else if (symbol.includes('XRP')) {
    basePrice = 0.67;
  } else {
    basePrice = 100;
  }
  
  // Generate random candles with trend tendencies
  let currentPrice = basePrice;
  const now = new Date();
  let timeInterval;
  
  switch (timeframe) {
    case '5m': timeInterval = 5 * 60 * 1000; break;
    case '15m': timeInterval = 15 * 60 * 1000; break;
    case '4h': timeInterval = 4 * 60 * 60 * 1000; break;
    case '1d': timeInterval = 24 * 60 * 60 * 1000; break;
    case '1w': timeInterval = 7 * 24 * 60 * 60 * 1000; break;
    case '1h':
    default: timeInterval = 60 * 60 * 1000;
  }
  
  // Add some trend bias
  const trendBias = Math.random() > 0.5 ? 1 : -1;
  
  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * timeInterval));
    
    // Introduce some volatility based on timeframe
    const volatilityFactor = timeframe === '1w' ? 0.05 : 
                            timeframe === '1d' ? 0.03 : 
                            timeframe === '4h' ? 0.02 : 0.01;
    
    const volatility = basePrice * volatilityFactor;
    
    // Random price movements with trend bias
    const change = (Math.random() - 0.5 + trendBias * 0.1) * volatility;
    currentPrice += change;
    
    // Ensure price doesn't go too extreme
    if (currentPrice < basePrice * 0.7 || currentPrice > basePrice * 1.3) {
      currentPrice = basePrice * (0.85 + Math.random() * 0.3);
    }
    
    // Generate candle values
    const open = currentPrice;
    const high = open + (Math.random() * volatility * 0.5);
    const low = open - (Math.random() * volatility * 0.5);
    const close = (open + high + low) / 3 + (Math.random() - 0.5) * volatility * 0.3;
    
    data.push({
      time: Math.floor(time.getTime() / 1000),
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * basePrice * 100)
    });
  }
  
  return data;
};

const TradingChart = () => {
  const dispatch = useDispatch();
  const chartContainerRef = useRef(null);
  const selectedAsset = useSelector(selectSelectedAsset);
  const timeframe = useSelector(selectChartTimeframe);
  
  const [chart, setChart] = useState(null);
  const [candleSeries, setCandleSeries] = useState(null);
  const [volumeSeries, setVolumeSeries] = useState(null);
  
  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Clear previous chart
    chartContainerRef.current.innerHTML = '';
    
    const newChart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: '#1A202C', // Match with Tailwind gray-800
        textColor: '#E2E8F0',
        fontFamily: 'Inter, sans-serif'
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.6)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.6)' }
      },
      crosshair: {
        mode: CrosshairMode.Normal
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
        timeVisible: true
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)'
      }
    });
    
    // Create series
    const newCandleSeries = newChart.addCandlestickSeries({
      upColor: '#4CAF50', // Green for up candles
      downColor: '#F44336', // Red for down candles
      borderUpColor: '#4CAF50',
      borderDownColor: '#F44336',
      wickUpColor: '#4CAF50',
      wickDownColor: '#F44336'
    });
    
    const newVolumeSeries = newChart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume'
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0
      }
    });
    
    setChart(newChart);
    setCandleSeries(newCandleSeries);
    setVolumeSeries(newVolumeSeries);
    
    // Handle resize
    const handleResize = () => {
      if (newChart) {
        newChart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (newChart) {
        newChart.remove();
      }
    };
  }, []);
  
  // Update chart data when asset or timeframe changes
  useEffect(() => {
    if (!candleSeries || !volumeSeries || !selectedAsset) return;
    
    // Generate mock data for the selected asset and timeframe
    const candleData = generateMockCandlestickData(selectedAsset, timeframe);
    
    // Generate volume data from candle data
    const volumeData = candleData.map(candle => ({
      time: candle.time,
      value: candle.volume,
      color: candle.close > candle.open ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'
    }));
    
    // Set chart data
    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    
    // Fit content
    if (chart) {
      chart.timeScale().fitContent();
    }
  }, [selectedAsset, timeframe, candleSeries, volumeSeries, chart]);
  
  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="border-b border-gray-700 p-3 flex justify-between items-center">
        <div className="flex overflow-x-auto">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.value}
              className={`px-3 py-1 mr-1 text-xs rounded ${
                timeframe === tf.value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => dispatch(setChartTimeframe(tf.value))}
            >
              {tf.label}
            </button>
          ))}
        </div>
        
        <div className="text-gray-400 text-xs">
          {selectedAsset ? `${selectedAsset} / ${timeframe}` : 'Select a market'}
        </div>
      </div>
      
      <div className="flex-grow relative">
        <div 
          ref={chartContainerRef} 
          className="absolute inset-0"
        />
      </div>
    </div>
  );
};

export default TradingChart;
