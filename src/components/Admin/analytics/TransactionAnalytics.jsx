import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaChartPie, 
  FaChartBar, 
  FaCalendarAlt, 
  FaArrowUp, 
  FaArrowDown, 
  FaFilter, 
  FaDownload,
  FaExchangeAlt
} from 'react-icons/fa';
import { useDarkMode } from '../../../context/DarkModeContext';
import PageTransition from '../../common/PageTransition';
import ComponentLoader from '../../common/ComponentLoader';

// Chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const TransactionAnalytics = () => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [transactionType, setTransactionType] = useState('all');
  const [chartData, setChartData] = useState(null);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine className="mr-2" /> },
    { id: 'deposits', label: 'Deposits', icon: <FaArrowDown className="mr-2" /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <FaArrowUp className="mr-2" /> },
    { id: 'comparison', label: 'Comparison', icon: <FaChartBar className="mr-2" /> }
  ];
  
  useEffect(() => {
    document.title = "Transaction Analytics | Admin Dashboard";
    fetchAnalyticsData();
  }, [activeTab, timeRange, transactionType]);
  
  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate mock data based on the selected tab and time range
    generateMockData();
    
    setLoading(false);
  };
  
  const generateMockData = () => {
    let labels = [];
    
    // Generate labels based on selected time range
    switch (timeRange) {
      case '7d':
        labels = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        break;
      case '30d':
        labels = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return i % 5 === 0 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        });
        break;
      case '90d':
        labels = [...Array(12)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - 90 + (i * 7.5));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        break;
      case '1y':
        labels = [...Array(12)].map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - 12 + i);
          return d.toLocaleDateString('en-US', { month: 'short' });
        });
        break;
      default:
        labels = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return i % 5 === 0 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        });
    }
    
    // Generate datasets based on active tab
    let datasets = [];
    
    // Common chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: darkMode ? '#e5e7eb' : '#4b5563',
            font: {
              family: "'Inter', sans-serif",
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: darkMode ? '#1f2937' : 'white',
          titleColor: darkMode ? '#e5e7eb' : '#111827',
          bodyColor: darkMode ? '#d1d5db' : '#4b5563',
          borderColor: darkMode ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          boxPadding: 3,
          usePointStyle: true,
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)'
          },
          ticks: {
            color: darkMode ? '#9ca3af' : '#6b7280'
          }
        },
        y: {
          grid: {
            color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)'
          },
          ticks: {
            color: darkMode ? '#9ca3af' : '#6b7280'
          }
        }
      }
    };
    
    switch (activeTab) {
      case 'overview':
        datasets = [
          {
            label: 'Deposits',
            data: labels.map(() => Math.floor(Math.random() * 50000) + 10000),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.3
          },
          {
            label: 'Withdrawals',
            data: labels.map(() => Math.floor(Math.random() * 40000) + 5000),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            tension: 0.3
          }
        ];
        
        setChartData({
          type: 'line',
          data: { labels, datasets },
          options: chartOptions
        });
        break;
        
      case 'deposits':
        datasets = [
          {
            label: 'Deposit Volume',
            data: labels.map(() => Math.floor(Math.random() * 50000) + 10000),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.3
          }
        ];
        
        setChartData({
          type: 'line',
          data: { labels, datasets },
          options: chartOptions
        });
        break;
        
      case 'withdrawals':
        datasets = [
          {
            label: 'Withdrawal Volume',
            data: labels.map(() => Math.floor(Math.random() * 40000) + 5000),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            tension: 0.3
          }
        ];
        
        setChartData({
          type: 'line',
          data: { labels, datasets },
          options: chartOptions
        });
        break;
        
      case 'comparison':
        const depositData = labels.map(() => Math.floor(Math.random() * 50000) + 10000);
        const withdrawalData = labels.map(() => Math.floor(Math.random() * 40000) + 5000);
        
        datasets = [
          {
            label: 'Deposits',
            data: depositData,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: '#3b82f6',
            borderWidth: 1
          },
          {
            label: 'Withdrawals',
            data: withdrawalData,
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: '#ef4444',
            borderWidth: 1
          }
        ];
        
        setChartData({
          type: 'bar',
          data: { labels, datasets },
          options: {
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              x: {
                ...chartOptions.scales.x,
                stacked: false
              },
              y: {
                ...chartOptions.scales.y,
                stacked: false
              }
            }
          }
        });
        break;
        
      default:
        setChartData(null);
    }
  };
  
  const renderChart = () => {
    if (!chartData) return null;
    
    switch (chartData.type) {
      case 'line':
        return <Line data={chartData.data} options={chartData.options} />;
      case 'bar':
        return <Bar data={chartData.data} options={chartData.options} />;
      case 'pie':
        return <Pie data={chartData.data} options={chartData.options} />;
      default:
        return null;
    }
  };
  
  // Mock summary data
  const summaryData = {
    total: {
      volume: '$2,650,450',
      count: '5,234',
      change: '+12.5%'
    },
    deposits: {
      volume: '$1,520,300',
      count: '3,122',
      change: '+15.2%'
    },
    withdrawals: {
      volume: '$1,130,150',
      count: '2,112',
      change: '+8.7%'
    }
  };
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Transaction Analytics
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Analyze deposit and withdrawal trends over time
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={() => {}}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaDownload className="mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`rounded-lg p-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Transaction Volume
                </p>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {summaryData.total.volume}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${
                darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
              }`}>
                <FaExchangeAlt className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {summaryData.total.count} transactions
              </p>
              <p className="flex items-center text-sm text-green-500">
                <FaArrowUp className="mr-1 h-3 w-3" /> {summaryData.total.change}
              </p>
            </div>
          </div>
          
          <div className={`rounded-lg p-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Deposits
                </p>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {summaryData.deposits.volume}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${
                darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <FaArrowDown className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {summaryData.deposits.count} transactions
              </p>
              <p className="flex items-center text-sm text-green-500">
                <FaArrowUp className="mr-1 h-3 w-3" /> {summaryData.deposits.change}
              </p>
            </div>
          </div>
          
          <div className={`rounded-lg p-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Withdrawals
                </p>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {summaryData.withdrawals.volume}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${
                darkMode ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <FaArrowUp className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {summaryData.withdrawals.count} transactions
              </p>
              <p className="flex items-center text-sm text-green-500">
                <FaArrowUp className="mr-1 h-3 w-3" /> {summaryData.withdrawals.change}
              </p>
            </div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        } mb-6`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between">
            <div className="flex overflow-x-auto mb-3 sm:mb-0 pb-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-sm font-medium rounded-md mr-2 flex items-center ${
                    activeTab === tab.id
                      ? darkMode
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-100 text-primary-700'
                      : darkMode
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`text-sm rounded-md border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className={`text-sm rounded-md border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="all">All Types</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Credit Card</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
          </div>
          
          <div className="p-4 h-96">
            {loading ? (
              <ComponentLoader height="100%" message="Loading transaction data..." />
            ) : (
              renderChart()
            )}
          </div>
        </div>
        
        {/* Transaction Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Transaction by Method
              </h3>
            </div>
            <div className="p-4 h-64">
              <Pie 
                data={{
                  labels: ['Bank Transfer', 'Credit Card', 'Cryptocurrency', 'E-Wallet'],
                  datasets: [
                    {
                      data: [40, 30, 20, 10],
                      backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(139, 92, 246, 0.7)'
                      ],
                      borderColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6'
                      ],
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: darkMode ? '#e5e7eb' : '#4b5563',
                        font: {
                          family: "'Inter', sans-serif",
                          size: 12
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Transaction Success Rate
              </h3>
            </div>
            <div className="p-4 h-64">
              <Bar 
                data={{
                  labels: ['Bank Transfer', 'Credit Card', 'Cryptocurrency', 'E-Wallet'],
                  datasets: [
                    {
                      label: 'Success Rate (%)',
                      data: [98.5, 95.2, 99.1, 97.8],
                      backgroundColor: 'rgba(16, 185, 129, 0.7)',
                      borderColor: '#10b981',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: darkMode ? '#e5e7eb' : '#4b5563',
                        font: {
                          family: "'Inter', sans-serif",
                          size: 12
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: 90,
                      max: 100,
                      grid: {
                        color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)'
                      },
                      ticks: {
                        color: darkMode ? '#9ca3af' : '#6b7280'
                      }
                    },
                    x: {
                      grid: {
                        color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)'
                      },
                      ticks: {
                        color: darkMode ? '#9ca3af' : '#6b7280'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TransactionAnalytics;
