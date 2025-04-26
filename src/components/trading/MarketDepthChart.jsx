import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Chart, registerables } from 'chart.js';
import { selectOrderBook } from '../../redux/slices/tradingSlice';

// Register Chart.js components
Chart.register(...registerables);

const MarketDepthChart = ({ symbol }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const orderBook = useSelector(selectOrderBook);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Process data for depth chart
    const processDepthData = () => {
      if (!orderBook || !orderBook.asks || !orderBook.bids) {
        return { bidData: [], askData: [], labels: [] };
      }
      
      const asks = [...orderBook.asks].sort((a, b) => a.price - b.price);
      const bids = [...orderBook.bids].sort((a, b) => b.price - a.price);
      
      // Create cumulative sums
      let bidSum = 0;
      const bidData = bids.map(bid => {
        bidSum += bid.quantity;
        return { x: bid.price, y: bidSum };
      });
      
      let askSum = 0;
      const askData = asks.map(ask => {
        askSum += ask.quantity;
        return { x: ask.price, y: askSum };
      });
      
      // Create labels (prices)
      const allPrices = [...bidData.map(d => d.x), ...askData.map(d => d.x)];
      const maxPrice = Math.max(...allPrices);
      const minPrice = Math.min(...allPrices);
      const priceRange = maxPrice - minPrice;
      
      return { bidData, askData, minPrice, maxPrice, priceRange };
    };
    
    const { bidData, askData, minPrice, maxPrice, priceRange } = processDepthData();
    
    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Bids',
            data: bidData,
            borderColor: 'rgba(72, 187, 120, 0.8)',
            backgroundColor: 'rgba(72, 187, 120, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.1,
            stepped: 'before'
          },
          {
            label: 'Asks',
            data: askData,
            borderColor: 'rgba(245, 101, 101, 0.8)',
            backgroundColor: 'rgba(245, 101, 101, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.1,
            stepped: 'after'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: Math.max(0, minPrice - priceRange * 0.05),
            max: maxPrice + priceRange * 0.05,
            grid: {
              color: 'rgba(75, 85, 99, 0.3)'
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 10
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(75, 85, 99, 0.3)'
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (tooltipItems) => {
                return `Price: ${tooltipItems[0].parsed.x.toFixed(2)}`;
              },
              label: (context) => {
                const label = context.dataset.label || '';
                return `${label}: ${context.parsed.y.toFixed(6)}`;
              }
            }
          },
          legend: {
            labels: {
              color: '#D1D5DB',
              font: {
                size: 11
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        animation: false,
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [orderBook]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Market Depth</h3>
        <div className="text-xs text-gray-400">{symbol}</div>
      </div>
      
      <div className="flex-grow p-2">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
};

MarketDepthChart.propTypes = {
  symbol: PropTypes.string.isRequired
};

export default MarketDepthChart;
