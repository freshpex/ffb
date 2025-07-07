import React from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaTrophy, FaCoins, FaCalendarCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CompletedTaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <FaTrophy className="mx-auto text-4xl text-gray-500 mb-3" />
        <h3 className="text-lg font-medium text-gray-300">No completed tasks yet</h3>
        <p className="text-gray-400 mt-2">
          Complete tasks to earn rewards and see them listed here.
        </p>
      </div>
    );
  }

  // Format reward amount and type
  const formatReward = (amount, type = 'cash') => {
    if (type === 'cash' || type === 'bonus') {
      return `$${amount.toFixed(2)}`;
    }
    if (type === 'points') {
      return `${amount} pts`;
    }
    if (type === 'discount') {
      return `${amount}% off`;
    }
    return amount;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FaCheckCircle className="mr-2 text-green-500" />
        Completed Tasks
      </h3>
      
      <ul className="space-y-3">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-md p-3 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="bg-green-600/20 rounded-full p-2 mr-3">
                <FaCheckCircle className="text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-medium">{task.title}</h4>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <FaCalendarCheck className="mr-1" />
                  <span>Completed {formatDate(task.userProgress.completedAt || task.userProgress.updatedAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-right">
              <div className="bg-gray-800 rounded-md py-1 px-3 flex items-center">
                <FaCoins className="text-yellow-500 mr-1" />
                <span className="text-white font-medium">
                  {formatReward(task.reward.amount, task.reward.type)}
                </span>
              </div>
              
              {task.userProgress.status === 'claimed' && (
                <span className="ml-2 text-xs bg-green-900/30 text-green-400 border border-green-500 rounded-full px-2 py-1">
                  Claimed
                </span>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

CompletedTaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      reward: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired
      }).isRequired,
      userProgress: PropTypes.shape({
        status: PropTypes.string.isRequired,
        completedAt: PropTypes.string,
        updatedAt: PropTypes.string
      }).isRequired
    })
  ).isRequired
};

export default CompletedTaskList;
