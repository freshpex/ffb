import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaCoins, 
  FaChartBar, 
  FaCalendarCheck, 
  FaUserClock,
  FaPercentage,
  FaSpinner
} from 'react-icons/fa';

const TaskStats = ({ statistics, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex justify-center items-center h-40">
        <FaSpinner className="text-blue-500 text-3xl animate-spin" />
      </div>
    );
  }

  // Format currency value
  const formatCurrency = (value) => {
    return `$${parseFloat(value).toFixed(2)}`;
  };

  // Format percentage value
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(0)}%`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FaChartBar className="mr-2 text-blue-500" />
        Task Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Completed */}
        <motion.div 
          className="bg-gray-700 p-4 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="bg-green-600/20 p-3 rounded-full mr-3">
              <FaCalendarCheck className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Completed</p>
              <p className="text-white text-xl font-semibold">{statistics.totalCompleted}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Total Earnings */}
        <motion.div 
          className="bg-gray-700 p-4 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="bg-yellow-600/20 p-3 rounded-full mr-3">
              <FaCoins className="text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Earnings</p>
              <p className="text-white text-xl font-semibold">{formatCurrency(statistics.totalEarnings)}</p>
            </div>
          </div>
        </motion.div>
        
        {/* In Progress */}
        <motion.div 
          className="bg-gray-700 p-4 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-blue-600/20 p-3 rounded-full mr-3">
              <FaUserClock className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-white text-xl font-semibold">{statistics.totalInProgress}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Completion Rate */}
        <motion.div 
          className="bg-gray-700 p-4 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="bg-purple-600/20 p-3 rounded-full mr-3">
              <FaPercentage className="text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-white text-xl font-semibold">{formatPercentage(statistics.completionRate)}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Category Breakdown */}
      {statistics.categoryBreakdown && Object.keys(statistics.categoryBreakdown).length > 0 && (
        <div className="mt-6">
          <h4 className="text-gray-300 mb-3 text-sm font-medium">Category Breakdown</h4>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="space-y-3">
              {Object.entries(statistics.categoryBreakdown).map(([category, count], index) => {
                // Format category name
                const formattedCategory = category.charAt(0).toUpperCase() + 
                  category.slice(1).replace("_", " ");
                
                // Calculate percentage
                const percentage = (count / statistics.totalCompleted) * 100;
                
                // Get appropriate color for each category
                const colors = [
                  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{formattedCategory}</span>
                      <span className="text-sm text-gray-400">{count}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`${color} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TaskStats.propTypes = {
  statistics: PropTypes.shape({
    totalCompleted: PropTypes.number.isRequired,
    totalEarnings: PropTypes.number.isRequired,
    totalInProgress: PropTypes.number.isRequired,
    completionRate: PropTypes.number.isRequired,
    categoryBreakdown: PropTypes.object
  }).isRequired,
  loading: PropTypes.bool
};

export default TaskStats;
