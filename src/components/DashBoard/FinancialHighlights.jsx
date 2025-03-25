import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartPie, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FinancialHighlights = () => {
  const [portfolioData] = useState({
    totalInvestment: 0,
    currentValue: 0,
    totalProfit: 0,
    profitPercentage: 0,
    allocation: [
      { name: 'Bitcoin', percentage: 40, color: '#f7931a' },
      { name: 'Ethereum', percentage: 25, color: '#627eea' },
      { name: 'Traditional Markets', percentage: 20, color: '#2196f3' },
      { name: 'Other Crypto', percentage: 15, color: '#9c27b0' }
    ]
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FaChartPie className="mr-2 text-primary-500" /> Financial Highlights
        </h2>
        <Link to="/login/investmentplans" className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          View Investment Plans
        </Link>
      </div>
      
      <div className="p-6">
        {portfolioData.totalInvestment > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Portfolio Allocation</h3>
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {portfolioData.allocation.reduce((acc, item, i) => {
                    const startAngle = acc.angle;
                    const angle = (item.percentage / 100) * 360;
                    const endAngle = startAngle + angle;
                    
                    // Convert angles to radians for calculations
                    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                    
                    // Calculate points on circle
                    const x1 = 50 + 40 * Math.cos(startAngleRad);
                    const y1 = 50 + 40 * Math.sin(startAngleRad);
                    const x2 = 50 + 40 * Math.cos(endAngleRad);
                    const y2 = 50 + 40 * Math.sin(endAngleRad);
                    
                    // Use arc flag to determine if angle is greater than 180 degrees
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    const pathData = `
                      M 50 50
                      L ${x1} ${y1}
                      A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                      Z
                    `;
                    
                    const path = (
                      <path
                        key={i}
                        d={pathData}
                        fill={item.color}
                        stroke="#1f2937"
                        strokeWidth="1"
                      />
                    );
                    
                    return {
                      paths: [...acc.paths, path],
                      angle: endAngle
                    };
                  }, { paths: [], angle: 0 }).paths}
                </svg>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Asset Breakdown</h3>
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {portfolioData.allocation.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    variants={itemVariants}
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-200">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-200 font-medium">
                        {formatCurrency((item.percentage / 100) * portfolioData.currentValue)}
                      </div>
                      <div className="text-xs text-gray-400">{item.percentage}%</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="lg:col-span-2 bg-gray-900 rounded-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Total Investment</h4>
                  <p className="text-xl font-bold text-white">{formatCurrency(portfolioData.totalInvestment)}</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Current Value</h4>
                  <p className="text-xl font-bold text-white">{formatCurrency(portfolioData.currentValue)}</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Total Profit</h4>
                  <p className={`text-xl font-bold ${portfolioData.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(portfolioData.totalProfit)}
                  </p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Profit %</h4>
                  <p className={`text-xl font-bold flex items-center justify-center ${portfolioData.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolioData.profitPercentage >= 0 ? 
                      <FaArrowUp className="mr-1" /> : 
                      <FaArrowDown className="mr-1" />
                    }
                    {Math.abs(portfolioData.profitPercentage).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg py-12 px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
              <FaChartPie size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-200 mb-2">No active investments</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start your investment journey by exploring our investment plans. Diversify your portfolio and grow your wealth with us.
            </p>
            <Link 
              to="/login/investmentplans" 
              className="inline-flex items-center justify-center px-5 py-3 font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              Explore Investment Plans
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FinancialHighlights;
