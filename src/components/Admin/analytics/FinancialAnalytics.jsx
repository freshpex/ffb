import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaDollarSign, 
  FaMoneyBillWave, 
  FaChartPie, 
  FaPercentage, 
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

const FinancialAnalytics = () => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    document.title = "Financial Analytics | Admin Dashboard";
    fetchAnalyticsData();
  }, [timeRange]);
  
  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate mock data
    generateMockData();
    
    setLoading(false);
  };
  
  const generateMockData = () => {
    // Generate date labels based on selected time range
    let labels = [];
    let revenueData = [];
    let expensesData = [];
    let profitData = [];
    
    switch (timeRange) {
      case '7d':
        labels = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        revenueData = labels.map(() => Math.floor(Math.random() * 30000) + 20000);
        expensesData = labels.map(() => Math.floor(Math.random() * 15000) + 10000);
        break;
      case '30d':
        labels = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return i % 5 === 0 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        });
        revenueData = labels.map(() => Math.floor(Math.random() * 100000) + 50000);
        expensesData = labels.map(() => Math.floor(Math.random() * 50000) + 30000);
        break;
      case '90d':
        labels = [...Array(12)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - 90 + (i * 7.5));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        revenueData = labels.map(() => Math.floor(Math.random() * 300000) + 150000);
        expensesData = labels.map(() => Math.floor(Math.random() * 150000) + 100000);
        break;
      case '1y':
        labels = [...Array(12)].map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - 12 + i);
          return d.toLocaleDateString('en-US', { month: 'short' });
        });
        revenueData = labels.map(() => Math.floor(Math.random() * 1000000) + 500000);
        expensesData = labels.map(() => Math.floor(Math.random() * 500000) + 300000);
        break;
      default:
        labels = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return i % 5 === 0 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        });
        revenueData = labels.map(() => Math.floor(Math.random() * 100000) + 50000);
        expensesData = labels.map(() => Math.floor(Math.random() * 50000) + 30000);
    }
    
    // Calculate profit data
    profitData = revenueData.map((revenue, idx) => revenue - expensesData[idx]);
    
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
    
    // Create chart data
    setChartData({
      revenueChart: {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: revenueData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              tension: 0.3
            },
            {
              label: 'Expenses',
              data: expensesData,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.5)',
              tension: 0.3
            },
            {
              label: 'Profit',
              data: profitData,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              tension: 0.3
            }
          ]
        },
        options: chartOptions
      },
      revenueSourcesChart: {
        type: 'doughnut',
        data: {
          labels: ['Transaction Fees', 'Subscription Plans', 'Exchange Fees', 'Premium Services', 'Other'],
          datasets: [
            {
              data: [40, 25, 20, 10, 5],
              backgroundColor: [
                'rgba(16, 185, 129, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(107, 114, 128, 0.7)'
              ],
              borderColor: [
                '#10b981',
                '#3b82f6',
                '#f59e0b',
                '#8b5cf6',
                '#6b7280'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
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
        }
      },
      monthlyCostsChart: {
        type: 'bar',
        data: {
          labels: ['Infrastructure', 'Staff', 'Marketing', 'Operations', 'Legal & Compliance', 'Other'],
          datasets: [
            {
              label: 'Monthly Costs',
              data: [35000, 85000, 25000, 18000, 15000, 8000],
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: '#ef4444',
              borderWidth: 1
            }
          ]
        },
        options: {
          ...chartOptions,
          indexAxis: 'y',
          scales: {
            x: {
              ...chartOptions.scales.x,
              beginAtZero: true
            },
            y: {
              ...chartOptions.scales.y
            }
          }
        }
      }
    });
  };
  
  // Mock revenue metrics
  const revenueMetrics = {
    totalRevenue: '$2,450,800',
    monthlyRevenue: '$186,500',
    revenueGrowth: '+15.2%',
    avgTransactionFee: '$2.85',
    projectedAnnual: '$2.8M'
  };
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Financial Analytics
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Revenue, expenses, and financial projections
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3 items-center">
            <div className="flex items-center">
              <label htmlFor="timeRange" className={`mr-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Time Range:
              </label>
              <select
                id="timeRange"
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
            </div>
            <button
              onClick={() => {}}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Revenue Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Revenue (YTD)
            </p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
              {revenueMetrics.totalRevenue}
            </h3>
            <p className="flex items-center text-sm text-green-500 mt-1">
              <FaArrowUp className="mr-1 h-3 w-3" /> {revenueMetrics.revenueGrowth} year-over-year
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Monthly Revenue
            </p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
              {revenueMetrics.monthlyRevenue}
            </h3>
            <p className="flex items-center text-sm text-green-500 mt-1">
              <FaArrowUp className="mr-1 h-3 w-3" /> +8.3% month-over-month
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Avg. Transaction Fee
            </p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
              {revenueMetrics.avgTransactionFee}
            </h3>
            <p className="flex items-center text-sm text-red-500 mt-1">
              <FaArrowDown className="mr-1 h-3 w-3" /> -0.15% from last month
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Operating Margin
            </p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
              42.5%
            </h3>
            <p className="flex items-center text-sm text-green-500 mt-1">
              <FaArrowUp className="mr-1 h-3 w-3" /> +3.2% from last quarter
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Projected Annual Revenue
            </p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
              {revenueMetrics.projectedAnnual}
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Based on current growth rates
            </p>
          </div>
        </div>
        
        {/* Revenue & Expenses Chart */}
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        } mb-6`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Revenue, Expenses & Profit
            </h3>
          </div>
          <div className="p-4 h-96">
            {loading ? (
              <ComponentLoader height="100%" message="Loading financial data..." />
            ) : (
              chartData && <Line data={chartData.revenueChart.data} options={chartData.revenueChart.options} />
            )}
          </div>
        </div>
        
        {/* Revenue Sources & Monthly Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue Sources
              </h3>
            </div>
            <div className="p-4 h-80">
              {loading ? (
                <ComponentLoader height="100%" message="Loading revenue data..." />
              ) : (
                chartData && <Doughnut data={chartData.revenueSourcesChart.data} options={chartData.revenueSourcesChart.options} />
              )}
            </div>
          </div>
          
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Monthly Operating Costs
              </h3>
            </div>
            <div className="p-4 h-80">
              {loading ? (
                <ComponentLoader height="100%" message="Loading cost data..." />
              ) : (
                chartData && <Bar data={chartData.monthlyCostsChart.data} options={chartData.monthlyCostsChart.options} />
              )}
            </div>
          </div>
        </div>
        
        {/* Financial Highlights */}
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        } mb-6`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Financial Highlights
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Revenue Growth Drivers
                </h4>
                <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Increased user acquisition rate (+25%)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Higher transaction volume (+18%)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Premium subscription conversions (+32%)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    New market expansions (3 countries)
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cost Efficiency Initiatives
                </h4>
                <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Infrastructure optimization (-12% cost)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Automated customer support flows
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Renegotiated payment processing fees
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Streamlined compliance procedures
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Financial Projections (Next Quarter)
                </h4>
                <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    Expected revenue: $750K - $850K
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    Projected profit margin: 44-46%
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    Operational expense increase: 5-7%
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    New revenue streams: 2 planned launches
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FinancialAnalytics;
