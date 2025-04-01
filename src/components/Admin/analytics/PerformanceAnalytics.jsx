import { useState, useEffect } from 'react';
import { 
  FaServer, 
  FaTachometerAlt, 
  FaClock, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimesCircle,
  FaRegClock,
  FaChartArea,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaUsers
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
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const PerformanceAnalytics = () => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [serverData, setServerData] = useState(null);
  
  useEffect(() => {
    document.title = "Performance Analytics | Admin Dashboard";
    fetchPerformanceData();
  }, [timeRange]);
  
  const fetchPerformanceData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data
    generateMockData();
    
    setLoading(false);
  };
  
  const generateMockData = () => {
    // Generate time labels based on selected time range
    let labels = [];
    let cpuUsageData = [];
    let memoryUsageData = [];
    let responseTimeData = [];
    let errorRateData = [];
    let requestsData = [];
    
    switch (timeRange) {
      case '24h':
        // Last 24 hours with hourly data points
        labels = [...Array(24)].map((_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (23 - i));
          return d.toLocaleTimeString('en-US', { hour: '2-digit' });
        });
        break;
      case '7d':
        // Last 7 days with daily data points
        labels = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        break;
      case '30d':
        // Last 30 days with data points every 3 days
        labels = [...Array(10)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - 30 + (i * 3));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        break;
      default:
        // Default to 24 hours
        labels = [...Array(24)].map((_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (23 - i));
          return d.toLocaleTimeString('en-US', { hour: '2-digit' });
        });
    }
    
    // Generate realistic performance data
    cpuUsageData = labels.map(() => Math.floor(Math.random() * 30) + 20); // 20-50% CPU usage
    memoryUsageData = labels.map(() => Math.floor(Math.random() * 25) + 40); // 40-65% Memory usage
    responseTimeData = labels.map(() => Math.floor(Math.random() * 100) + 50); // 50-150ms response time
    errorRateData = labels.map(() => Math.random() * 1.5); // 0-1.5% error rate
    requestsData = labels.map(() => Math.floor(Math.random() * 3000) + 2000); // 2000-5000 requests
    
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
    setServerData({
      resourceUsageChart: {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'CPU Usage (%)',
              data: cpuUsageData,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Memory Usage (%)',
              data: memoryUsageData,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          ...chartOptions,
          scales: {
            ...chartOptions.scales,
            y: {
              ...chartOptions.scales.y,
              min: 0,
              max: 100,
              ticks: {
                ...chartOptions.scales.y.ticks,
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      },
      responseTimeChart: {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Response Time (ms)',
              data: responseTimeData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          ...chartOptions,
          scales: {
            ...chartOptions.scales,
            y: {
              ...chartOptions.scales.y,
              min: 0,
              ticks: {
                ...chartOptions.scales.y.ticks,
                callback: function(value) {
                  return value + 'ms';
                }
              }
            }
          }
        }
      },
      errorRateChart: {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Error Rate (%)',
              data: errorRateData,
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: '#ef4444',
              borderWidth: 1
            }
          ]
        },
        options: {
          ...chartOptions,
          scales: {
            ...chartOptions.scales,
            y: {
              ...chartOptions.scales.y,
              min: 0,
              max: 3,
              ticks: {
                ...chartOptions.scales.y.ticks,
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      },
      requestsChart: {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Requests',
              data: requestsData,
              backgroundColor: 'rgba(245, 158, 11, 0.7)',
              borderColor: '#f59e0b',
              borderWidth: 1
            }
          ]
        },
        options: chartOptions
      }
    });
  };
  
  // Mock server status data
  const serverStatus = {
    isOperational: true,
    lastIncident: "May 15, 2023 (3h 24m)",
    uptime: "99.98%",
    activeUsers: 1248,
    avgLoadTime: "68ms",
    errorRate: "0.42%"
  };
  
  // Mock service status
  const serviceStatus = [
    { name: "API Service", status: "operational", uptime: "99.9%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "Payment Processing", status: "operational", uptime: "100%" },
    { name: "Authentication", status: "operational", uptime: "99.95%" },
    { name: "File Storage", status: "degraded", uptime: "98.7%" },
    { name: "Email Service", status: "operational", uptime: "99.8%" }
  ];
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Performance Analytics
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Monitor system health, response times, and service availability
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
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
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
        
        {/* System Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaServer className={`text-lg mr-2 ${serverStatus.isOperational ? 'text-green-500' : 'text-red-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                System Status
              </p>
            </div>
            <h3 className={`text-lg font-semibold ${
              serverStatus.isOperational 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {serverStatus.isOperational ? 'Operational' : 'Outage'}
            </h3>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaRegClock className={`text-lg mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Last Incident
              </p>
            </div>
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {serverStatus.lastIncident}
            </h3>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaTachometerAlt className={`text-lg mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Uptime
              </p>
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {serverStatus.uptime}
            </h3>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaUsers className={`text-lg mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Active Users
              </p>
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {serverStatus.activeUsers}
            </h3>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaClock className={`text-lg mr-2 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Avg. Load Time
              </p>
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {serverStatus.avgLoadTime}
            </h3>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className={`text-lg mr-2 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Error Rate
              </p>
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {serverStatus.errorRate}
            </h3>
          </div>
        </div>
        
        {/* Server Resource Usage Chart */}
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        } mb-6`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Server Resource Usage
            </h3>
          </div>
          <div className="p-4 h-80">
            {loading ? (
              <ComponentLoader height="100%" message="Loading server data..." />
            ) : (
              serverData && 
              <Line data={serverData.resourceUsageChart.data} options={serverData.resourceUsageChart.options} />
            )}
          </div>
        </div>
        
        {/* Response Time & Error Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Response Time
              </h3>
            </div>
            <div className="p-4 h-64">
              {loading ? (
                <ComponentLoader height="100%" message="Loading response data..." />
              ) : (
                serverData && 
                <Line data={serverData.responseTimeChart.data} options={serverData.responseTimeChart.options} />
              )}
            </div>
          </div>
          
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Error Rate
              </h3>
            </div>
            <div className="p-4 h-64">
              {loading ? (
                <ComponentLoader height="100%" message="Loading error data..." />
              ) : (
                serverData && 
                <Bar data={serverData.errorRateChart.data} options={serverData.errorRateChart.options} />
              )}
            </div>
          </div>
        </div>
        
        {/* Service Status & Request Volume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Service Status
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {serviceStatus.map((service, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {service.status === 'operational' ? (
                        <FaCheckCircle className="mr-3 text-green-500" />
                      ) : service.status === 'degraded' ? (
                        <FaExclamationTriangle className="mr-3 text-yellow-500" />
                      ) : (
                        <FaTimesCircle className="mr-3 text-red-500" />
                      )}
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.status === 'operational'
                          ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                          : service.status === 'degraded'
                            ? darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                            : darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status === 'operational' ? 'Operational' : 
                         service.status === 'degraded' ? 'Degraded' : 'Down'}
                      </span>
                      <span className={`ml-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.uptime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Request Volume
              </h3>
            </div>
            <div className="p-4 h-72">
              {loading ? (
                <ComponentLoader height="100%" message="Loading request data..." />
              ) : (
                serverData && 
                <Bar data={serverData.requestsChart.data} options={serverData.requestsChart.options} />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PerformanceAnalytics;
