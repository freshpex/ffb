import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  FaArrowRight, 
  FaCheckCircle, 
  FaCoins, 
  FaPlay, 
  FaInfoCircle,
  FaLock, 
  FaRegClock, 
  FaChevronDown, 
  FaChevronUp,
  FaTrophy
} from 'react-icons/fa';
import Button from '../../common/Button';

const TaskItem = ({ task, onStart, onClaim }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Check if the task is in progress
  const isInProgress = task.userProgress?.status === 'in_progress';
  
  // Check if task is completed but not yet claimed
  const isCompletedNotClaimed = task.userProgress?.status === 'completed';
  
  // Check if task is already claimed
  const isClaimed = task.userProgress?.status === 'claimed';
  
  // Format reward amount
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
  
  // Get the appropriate tag color based on difficulty
  const getDifficultyTag = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500">
            Easy
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-500">
            Medium
          </span>
        );
      case 'hard':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-900/30 text-orange-400 border border-orange-500">
            Hard
          </span>
        );
      case 'expert':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-500">
            Expert
          </span>
        );
      default:
        return null;
    }
  };
  
  // Format category name
  const formatCategory = (category) => {
    if (!category) return "";
    return category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
  };
  
  // Calculate progress width percentage
  const progressWidth = task.userProgress ? `${task.userProgress.progress}%` : '0%';
  
  // Progress bar color based on completion percentage
  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-gray-500';
  };
  
  // Handle action button click
  const handleActionClick = () => {
    const taskId = task._id || task.id;
    if (!taskId) {
      console.error("Task ID is missing:", task);
      return;
    }
    
    if (isCompletedNotClaimed) {
      onClaim(taskId);
    } else if (!isInProgress && !isClaimed) {
      onStart(taskId);
    }
  };
  
  // Render action button
  const renderActionButton = () => {
    if (isCompletedNotClaimed) {
      return (
        <Button variant="success" onClick={handleActionClick} className="flex items-center">
          <FaCoins className="mr-2" /> Claim Reward
        </Button>
      );
    }
    
    if (isInProgress) {
      return (
        <div className="flex items-center text-sm text-blue-400">
          <FaRegClock className="mr-2" /> In Progress
        </div>
      );
    }
    
    if (isClaimed) {
      return (
        <div className="flex items-center text-sm text-green-400">
          <FaCheckCircle className="mr-2" /> Completed
        </div>
      );
    }
    
    return (
      <Button variant="primary" onClick={handleActionClick} className="flex items-center">
        <FaPlay className="mr-2" /> Start Task
      </Button>
    );
  };

  return (
    <div className="p-6 bg-gray-800 hover:bg-gray-750 transition-colors duration-150">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-white">{task.title}</h3>
              {task.isRecurring && (
                <span className="ml-2 px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-500">
                  Recurring
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {getDifficultyTag(task.difficulty)}
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                {formatCategory(task.category)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-400 mt-2">{task.description}</p>
          
          {task.userProgress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{task.userProgress.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`${getProgressColor(task.userProgress.progress)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: progressWidth }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-700/50 rounded-lg min-w-[100px]">
            <span className="text-xs text-gray-400 mb-1">Reward</span>
            <span className="text-lg font-bold text-yellow-400">
              {formatReward(task.reward, task.rewardType)}
            </span>
          </div>
          
          <div className="min-w-[140px]">
            {renderActionButton()}
          </div>
        </div>
      </div>
      
      {/* Expandable details section */}
      <div className="mt-4">
        <button
          className="text-sm text-gray-400 flex items-center hover:text-gray-300"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <FaChevronUp className="mr-2" /> Hide Details
            </>
          ) : (
            <>
              <FaChevronDown className="mr-2" /> Show Details
            </>
          )}
        </button>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Requirements</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {task.requirements && Object.entries(task.requirements).map(([key, value]) => (
                  <li key={key}>
                    {key.replace(/([A-Z])/g, ' $1')
                      .replace(/_/g, ' ')
                      .replace(/^./, str => str.toUpperCase())}: {value}
                  </li>
                ))}
                {!task.requirements || Object.keys(task.requirements).length === 0 && (
                  <li>Complete the described task</li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Details</h4>
              <ul className="text-gray-400 space-y-1">
                {task.duration > 0 && (
                  <li className="flex items-center">
                    <FaRegClock className="mr-2" /> 
                    Time limit: {task.duration} {task.duration === 1 ? 'day' : 'days'}
                  </li>
                )}
                {task.maxCompletions > 0 && (
                  <li className="flex items-center">
                    <FaTrophy className="mr-2" /> 
                    Can be completed: {task.maxCompletions} {task.maxCompletions === 1 ? 'time' : 'times'}
                  </li>
                )}
                {task.userProgress && (
                  <li className="flex items-center">
                    <FaInfoCircle className="mr-2" /> 
                    Started: {new Date(task.userProgress.startedAt).toLocaleDateString()}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onClaim: PropTypes.func.isRequired,
};

export default TaskItem;
