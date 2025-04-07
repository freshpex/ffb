import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaArrowRight } from 'react-icons/fa';
import { 
  fetchInvestmentStatistics, 
  selectInvestmentStatistics, 
  selectInvestmentStatus, 
  selectInvestmentError 
} from '../../redux/slices/investmentSlice';
import CardLoader from '../common/CardLoader';

const InvestmentSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const statistics = useSelector(selectInvestmentStatistics);
  // Add a null check and provide a default value
  const status = useSelector((state) => selectInvestmentStatus(state, 'statistics')) || 'idle';
  const error = useSelector((state) => selectInvestmentError(state, 'statistics'));
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInvestmentStatistics());
    }
  }, [status, dispatch]);
  
  // Show loading state
  if (status === 'loading') {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-3"></div>
          <div className="h-24 bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (status === 'failed') {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold text-white mb-4">Investment Summary</h2>
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
          <p className="text-red-400">Failed to load investment data: {error}</p>
        </div>
      </div>
    );
  }
  
  // Default values in case statistics is still null
  const { 
    totalInvested = 0, 
    totalReturns = 0, 
    activeInvestments = 0, 
    completedInvestments = 0,
    profitLoss = 0,
    profitLossPercentage = 0 
  } = statistics || {};

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Investment Summary</h2>
        <button 
          onClick={() => navigate('/login/investmentplans')}
          className="text-primary-500 text-sm flex items-center hover:text-primary-400"
        >
          View All <FaArrowRight className="ml-1" size={12} />
        </button>
      </div>
      
      <div className="flex items-center space-x-4 mb-4 bg-gray-700/50 p-3 rounded-lg">
        <div className="p-3 bg-primary-900/30 rounded-full">
          <FaChartLine className="text-primary-500" size={18} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Invested</p>
          <div className="flex items-baseline">
            <p className="text-xl font-bold text-gray-100">${totalInvested.toLocaleString()}</p>
            <p className="ml-2 text-green-500 text-sm">+${totalReturns.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">ACTIVE INVESTMENTS</p>
          <p className="text-gray-100 font-bold">{activeInvestments}</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">AVERAGE ROI</p>
          <p className="text-primary-500 font-bold">{statistics.averageROI?.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">COMPLETED</p>
          <p className="text-gray-100 font-bold">{completedInvestments}</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">RETURNS</p>
          <p className="text-green-500 font-bold">${totalReturns.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSummary;
