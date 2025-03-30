import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaArrowRight } from 'react-icons/fa';
import { 
  selectInvestmentStatistics,
  selectInvestmentStatus
} from '../../redux/slices/investmentSlice';
import CardLoader from '../common/CardLoader';

const InvestmentSummary = () => {
  const navigate = useNavigate();
  const stats = useSelector(selectInvestmentStatistics);
  const status = useSelector(selectInvestmentStatus);

  // If investments are still loading, show a skeleton loader
  if (status === 'loading') {
    return <CardLoader title="Investment Summary" height="h-64" />;
  }

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
            <p className="text-xl font-bold text-gray-100">${stats.totalInvested.toLocaleString()}</p>
            <p className="ml-2 text-green-500 text-sm">+${stats.totalReturns.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">ACTIVE INVESTMENTS</p>
          <p className="text-gray-100 font-bold">{stats.activeInvestments}</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">AVERAGE ROI</p>
          <p className="text-primary-500 font-bold">{stats.averageROI.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">COMPLETED</p>
          <p className="text-gray-100 font-bold">{stats.completedInvestments}</p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">RETURNS</p>
          <p className="text-green-500 font-bold">${stats.totalReturns.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSummary;
