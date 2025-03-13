import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaChartArea, FaSpinner } from 'react-icons/fa';
import binanceService from '../../services/binanceService';
import Chart from 'chart.js/auto';

const MarketDepthChart = ({ symbol }) => {
  const [depthData, setDepthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    const fetchMarketDepth = async () => {
      try {
        setIsLoading(true);
        const data = await binanceService.getMarketDepth(symbol, 20);
        setDepthData(data);
      } catch (err) {
        console.error(`Error fetching market depth for ${symbol}:`, err);
        setError('Failed to load market depth data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketDepth();
    
    // Update every 10 seconds
    const intervalId = setInterval(fetchMarketDepth, 10000);
    return () => clearInterval(intervalId);
  }, [symbol]);
  
  useEffect(() => {
    if (!depthData || !chartRef.current) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Process the depth data
    const processDepthData = (depthArray, reverse = false) => {
      let cumulative = 0;
      return depthArray.map(([price, quantity]) => {
        cumulative += parseFloat(quantity);
        return {
          price: parseFloat(price),
          quantity: parseFloat(quantity),
          total: cumulative
        };
      }).sort((a, b) => reverse ? b.price - a.price : a.price - b.price);
    };
    
    const bids = processDepthData(depthData.bids, true);
    const asks = processDepthData(depthData.asks);
    
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Bids',
            data: bids.map(bid => ({ x: bid.price, y: bid.total })),
            borderColor: 'rgba(76, 175, 80, 1)',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true
          },
          {
            label: 'Asks',
            data: asks.map(ask => ({ x: ask.price, y: ask.total })),
            borderColor: 'rgba(244, 67, 54, 1)',
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Price'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Quantity'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `${symbol} Order Book Depth`
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const price = context.parsed.x;
                const amount = context.parsed.y;
                return `Price: ${price.toFixed(2)} | Total: ${amount.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [depthData, symbol]);

  if (isLoading) {
    return (
      <div className="chart-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner size={30} />
        </motion.div>
        <span>Loading market depth...</span>
      </div>
    );
  }

  if (error) {
    return <div className="chart-error">{error}</div>;
  }

  return (
    <div className="market-depth-chart">
      <canvas ref={chartRef} height={300} />
    </div>
  );
};

export default MarketDepthChart;
