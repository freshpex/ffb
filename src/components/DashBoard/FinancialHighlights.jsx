import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartPie, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FinancialHighlights = () => {
  // In a real app, this would come from an API or context
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
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <h2 className="card-title">Financial Highlights</h2>
        <Link to="/login/investmentplans" className="view-all-btn">
          View Investment Plans
        </Link>
      </div>
      
      <div className="card-body">
        {portfolioData.totalInvestment > 0 ? (
          <div className="portfolio-container">
            <div className="portfolio-chart-container">
              <h3>Portfolio Allocation</h3>
              <div className="portfolio-chart">
                <svg viewBox="0 0 100 100" className="pie-chart">
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
                        stroke="#fff"
                        strokeWidth="0.5"
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
            
            <div className="portfolio-breakdown">
              <h3>Asset Breakdown</h3>
              {portfolioData.allocation.map((item, index) => (
                <div className="portfolio-item" key={index}>
                  <div className="portfolio-item-name">
                    <div 
                      className="portfolio-item-icon" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    {item.name}
                  </div>
                  <div>
                    <div className="portfolio-item-value">{formatCurrency((item.percentage / 100) * portfolioData.currentValue)}</div>
                    <div className="portfolio-item-percentage">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-portfolio">
            <div className="empty-state">
              <FaChartPie className="empty-state-icon" />
              <h3>No active investments</h3>
              <p>Start your investment journey by exploring our investment plans</p>
              <Link to="/login/investmentplans" className="form-btn">
                Explore Investment Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FinancialHighlights;
