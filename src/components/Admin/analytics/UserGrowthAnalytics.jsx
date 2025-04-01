import { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserPlus, 
  FaUserMinus, 
  FaUserClock, 
  FaGlobe, 
  FaDownload,
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
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

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

const UserGrowthAnalytics = () => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    document.title = "User Growth Analytics | Admin Dashboard";
    fetchUserData();
  }, [timeRange]);
  
  const fetchUserData = async () => {
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
    let newUsersData = [];
    let totalUsersData = [];
    let retentionRateData = [];
    
    switch (timeRange) {
      case '7d':
        labels = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        newUsersData = [45, 39, 53, 47, 65, 38, 41];
        totalUsersData = [4500, 4539, 4592, 4639, 4704, 4742, 4783];
        retentionRateData = [96.2, 96.4, 96.3, 96.5, 96.7, 96.8, 96.9];
        break;
      case '30d':
        labels = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return i % 5 === 0 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        });
        newUsersData = labels.map(() => Math.floor(Math.random() * 40) + 25);
        
        // Calculate total users with accumulation
        totalUsersData = [];
        let runningTotal = 4300;
        newUsersData.forEach((newUsers) => {
          runningTotal += newUsers;
          totalUsersData.push(runningTotal);
        });
        
        retentionRateData = labels.map(() => (Math.random() * 1) + 95.5);
        break;
      case '90d':
        labels = [...Array(12)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - 90 + (i * 7.5));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        newUsersData = labels.map(() => Math.floor(Math.random() * 250) + 150);
        
        // Calculate total users with accumulation
        totalUsersData = [];
        let total90d = 3800;
        newUsersData.forEach((newUsers) => {
          total90d += newUsers;
          totalUsersData.push(total90d);
        });
        
        retentionRateData = labels.map(() => (Math.random() * 1.5) + 94.5);
        break;
      case '1y':
        labels = [...Array(12)].map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - 12 + i);
          return d.toLocaleDateString('en-US', { month: 'short' });
        });
        newUsersData = labels.map(() => Math.floor(Math.random() * 1000) + 500);
        
        // Calculate total users with accumulation
        totalUsersData = [];
        let totalYear = 1500;
        newUsersData.forEach((newUsers) => {
          totalYear += newUsers;
          totalUsersData.push(totalYear);
        });
        
        retentionRateData = labels.map(() => (Math.random() * 2) + 93);
        break;
      default:
        labels = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return i % 5 === 0 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        });
        newUsersData = labels.map(() => Math.floor(Math.random() * 40) + 25);
        
        // Calculate total users with accumulation
        totalUsersData = [];
        let defaultTotal = 4300;
        newUsersData.forEach((newUsers) => {
          defaultTotal += newUsers;
          totalUsersData.push(defaultTotal);
        });
        
        retentionRateData = labels.map(() => (Math.random() * 1) + 95.5);
    }
    
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
    
    // Create chart data objects
    setChartData({
      userGrowthChart: {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Total Users',
              data: totalUsersData,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              yAxisID: 'y'
            },
            {
              label: 'New Users',
              data: newUsersData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.7)',
              borderWidth: 2,
              borderDash: [],
              type: 'bar',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          ...chartOptions,
          scales: {
            ...chartOptions.scales,
            y: {
              ...chartOptions.scales.y,
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Total Users',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false
              },
              title: {
                display: true,
                text: 'New Users',
                color: darkMode ? '#9ca3af' : '#6b7280'
              },
              ticks: {
                color: darkMode ? '#9ca3af' : '#6b7280'
              }
            }
          }
        }
      },
      retentionChart: {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Retention Rate (%)',
              data: retentionRateData,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          ...chartOptions,
          scales: {
            ...chartOptions.scales,
            y: {
              ...chartOptions.scales.y,
              min: 90,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      },
      userTypeChart: {
        type: 'doughnut',
        data: {
          labels: ['Basic', 'Premium', 'Pro', 'Enterprise'],
          datasets: [
            {
              data: [65, 20, 10, 5],
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',  // blue
                'rgba(16, 185, 129, 0.7)',  // green
                'rgba(245, 158, 11, 0.7)',  // yellow
                'rgba(139, 92, 246, 0.7)'   // purple
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
      }
    });
  };
  
  // Mock user data
  const userData = {
    totalUsers: 4783,
    newUsers: {
      daily: 41,
      weekly: 328,
      monthly: 1245
    },
    activeUsers: {
      daily: 3215,
      weekly: 3879,
      monthly: 4502
    },
    retention: "96.9%",
    conversionRate: "8.3%"
  };
  
  // Geographic data for the map
  const geographicData = [
    { country: 'United States', users: 1650, percentage: '34.5%' },
    { country: 'United Kingdom', users: 740, percentage: '15.5%' },
    { country: 'Germany', users: 485, percentage: '10.1%' },
    { country: 'France', users: 375, percentage: '7.8%' },
    { country: 'Canada', users: 320, percentage: '6.7%' },
    { country: 'Australia', users: 290, percentage: '6.1%' },
    { country: 'Japan', users: 215, percentage: '4.5%' },
    { country: 'Other Countries', users: 708, percentage: '14.8%' }
  ];
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              User Growth Analytics
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Track user acquisition, retention, and demographics
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
        
        {/* User Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaUsers className={`text-lg mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Users
              </p>
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userData.totalUsers.toLocaleString()}
            </h3>
            <p className="flex items-center text-sm text-green-500 mt-1">
              <FaArrowUp className="mr-1 h-3 w-3" /> +7.2% from last month
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaUserPlus className={`text-lg mr-2 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                New Users (Today)
              </p>
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userData.newUsers.daily}
            </h3>
            <p className="flex items-center text-sm text-green-500 mt-1">
              <FaArrowUp className="mr-1 h-3 w-3" /> +5.1% from yesterday
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaUserClock className={`text-lg mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Active Users (Today)
              </p>
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userData.activeUsers.daily.toLocaleString()}
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {Math.round((userData.activeUsers.daily / userData.totalUsers) * 100)}% of total users
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaUsers className={`text-lg mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Retention Rate
              </p>
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userData.retention}
            </h3>
            <p className="flex items-center text-sm text-green-500 mt-1">
              <FaArrowUp className="mr-1 h-3 w-3" /> +0.3% from last month
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center mb-2">
              <FaUserPlus className={`text-lg mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Conversion Rate
              </p>
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userData.conversionRate}
            </h3>
            <p className="flex items-center text-sm text-green-500 mt-1">
              <FaArrowUp className="mr-1 h-3 w-3" /> +1.2% from last month
            </p>
          </div>
        </div>
        
        {/* User Growth Chart */}
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        } mb-6`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              User Growth & Acquisition
            </h3>
          </div>
          <div className="p-4 h-96">
            {loading ? (
              <ComponentLoader height="100%" message="Loading user data..." />
            ) : (
              chartData && <Bar data={chartData.userGrowthChart.data} options={chartData.userGrowthChart.options} />
            )}
          </div>
        </div>
        
        {/* Retention & User Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                User Retention Rate
              </h3>
            </div>
            <div className="p-4 h-80">
              {loading ? (
                <ComponentLoader height="100%" message="Loading retention data..." />
              ) : (
                chartData && <Line data={chartData.retentionChart.data} options={chartData.retentionChart.options} />
              )}
            </div>
          </div>
          
          <div className={`rounded-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                User Account Types
              </h3>
            </div>
            <div className="p-4 h-80">
              {loading ? (
                <ComponentLoader height="100%" message="Loading user types data..." />
              ) : (
                chartData && <Doughnut data={chartData.userTypeChart.data} options={chartData.userTypeChart.options} />
              )}
            </div>
          </div>
        </div>
        
        {/* Geographic Distribution */}
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        } mb-6`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <FaGlobe className="mr-2" /> Geographic Distribution
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Country
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Users
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Percentage
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Distribution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {geographicData.map((item, index) => (
                    <tr key={index}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.country}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {item.users.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {item.percentage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: item.percentage }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserGrowthAnalytics;
