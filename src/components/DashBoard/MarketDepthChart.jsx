import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { selectOrderBook } from '../../redux/slices/tradingSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketDepthChart = ({ symbol }) => {
  const orderBook = useSelector(selectOrderBook);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!orderBook || !orderBook.bids || !orderBook.asks) return;

    // Process the order book data for the chart
    const processOrderBookData = () => {
      // Sort bids (descending) and asks (ascending)
      const bids = [...orderBook.bids].sort((a, b) => b.price - a.price);
      const asks = [...orderBook.asks].sort((a, b) => a.price - b.price);

      // Calculate cumulative amounts
      let cumulativeBids = [];
      let cumulativeAmount = 0;
      
      for (const bid of bids) {
        cumulativeAmount += bid.amount;
        cumulativeBids.push({ price: bid.price, amount: cumulativeAmount });
      }

      let cumulativeAsks = [];
      cumulativeAmount = 0;
      
      for (const ask of asks) {
        cumulativeAmount += ask.amount;
        cumulativeAsks.push({ price: ask.price, amount: cumulativeAmount });
      }

      // Create data for chart
      const bidPrices = cumulativeBids.map(bid => bid.price.toFixed(2));
      const bidAmounts = cumulativeBids.map(bid => bid.amount);
      
      const askPrices = cumulativeAsks.map(ask => ask.price.toFixed(2));
      const askAmounts = cumulativeAsks.map(ask => ask.amount);

      // Combine for labels
      const allPrices = [...bidPrices.reverse(), ...askPrices];

      // Create chart data
      setChartData({
        labels: allPrices,
        datasets: [
          {
            label: 'Bids',
            data: [...bidAmounts.reverse(), ...Array(askPrices.length).fill(null)],
            borderColor: 'rgba(46, 204, 113, 1)',
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            pointRadius: 0,
            borderWidth: 2,
            fill: true
          },
          {
            label: 'Asks',
            data: [...Array(bidPrices.length).fill(null), ...askAmounts],
            borderColor: 'rgba(231, 76, 60, 1)',
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            pointRadius: 0,
            borderWidth: 2,
            fill: true
          }
        ]
      });
    };

    processOrderBookData();
  }, [orderBook]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        },
        title: {
          display: true,
          text: 'Price',
          color: 'rgba(255, 255, 255, 0.9)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        title: {
          display: true,
          text: 'Cumulative Amount',
          color: 'rgba(255, 255, 255, 0.9)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.9)'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${value.toFixed(4)}`;
          }
        }
      },
      title: {
        display: true,
        text: `Market Depth - ${symbol}`,
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <div className="w-full h-full p-4">
      {chartData.labels.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading market depth data...</p>
        </div>
      )}
    </div>
  );
};

MarketDepthChart.propTypes = {
  symbol: PropTypes.string.isRequired
};

export default MarketDepthChart;
