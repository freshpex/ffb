import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaArrowRight } from 'react-icons/fa';
import { 
  selectAccountSummary,
  selectDashboardStatus
} from '../../../redux/slices/dashboardSlice';
import CardLoader from '../../common/CardLoader';

const InvestmentSummary = () => {
  const navigate = useNavigate();
  const accountSummary = useSelector(selectAccountSummary);
  const status = useSelector(state => selectDashboardStatus(state, 'accountSummary'));
  // Show loading state
  if (status === 'loading') {
    return <CardLoader title="Investment Summary" height="h-72" />;
  }
  
  // Extract investment data from account summary
  const totalInvested = accountSummary?.investmentTotal || 0;
  const totalReturns = accountSummary?.projectedEarnings || 0;
  const activeInvestments = accountSummary?.investmentCount || 0;
  const completedInvestments = accountSummary?.completedInvestments || 0;
  
  // Calculate ROI if possible
  const averageROI = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Investment Summary</h2>
        <button 
          onClick={() => navigate('/account/investments')}
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
            {totalReturns > 0 && (
              <p className="ml-2 text-green-500 text-sm">+${totalReturns.toLocaleString()}</p>
            )}
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
          <p className="text-primary-500 font-bold">{averageROI}%</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">COMPLETED</p>
          <p className="text-gray-100 font-bold">{completedInvestments}</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">PROJECTED EARNINGS</p>
          <p className="text-green-500 font-bold">${totalReturns.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSummary;
