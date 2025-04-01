import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaUsers, 
  FaExchangeAlt, 
  FaCreditCard
} from 'react-icons/fa';
import { useDarkMode } from '../../../context/DarkModeContext';
import PageTransition from '../../common/PageTransition';
import ComponentLoader from '../../common/ComponentLoader';
import { Link } from 'react-router-dom';

const AnalyticsOverview = () => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = "Analytics Overview | Admin Dashboard";
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <ComponentLoader height="500px" message="Loading analytics dashboard..." />;
  }
  
  const analyticsCards = [
    {
      title: "Transaction Analytics",
      description: "View detailed transaction trends, payment methods, and success rates",
      icon: FaExchangeAlt,
      color: "bg-blue-500",
      path: "/admin/analytics/transactions"
    },
    {
      title: "User Growth",
      description: "Track user acquisition, retention, and demographic analysis",
      icon: FaUsers,
      color: "bg-green-500",
      path: "/admin/analytics/users"
    },
    {
      title: "Platform Performance",
      description: "Monitor system health, response times, and service availability",
      icon: FaChartLine,
      color: "bg-purple-500",
      path: "/admin/analytics/performance"
    },
    {
      title: "Financial Reports",
      description: "Access revenue reports, fee analysis, and financial projections",
      icon: FaCreditCard,
      color: "bg-orange-500",
      path: "/admin/analytics/financial"
    }
  ];
  
  return (
    <PageTransition>
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Analytics Dashboard
        </h1>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Get insights into your platform's performance and user behavior
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyticsCards.map((card, index) => (
            <Link 
              to={card.path} 
              key={index}
              className={`block p-6 rounded-lg transition-transform transform hover:scale-[1.02] ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-full ${card.color} bg-opacity-20 mr-4`}>
                  <card.icon className={`h-6 w-6 ${card.color} text-opacity-100`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {card.title}
                  </h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className={`mt-8 p-4 rounded-lg ${
          darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            <strong>Pro Tip:</strong> Analytics data is updated every hour. For the most accurate insights, check the timestamp on each report.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default AnalyticsOverview;
