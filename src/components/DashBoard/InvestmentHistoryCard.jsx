import PropTypes from 'prop-types';
import { 
  FaCalendarDay, 
  FaCalendarCheck, 
  FaPercent, 
  FaMoneyBillWave, 
  FaChartLine,
  FaBan,
  FaMoneyBillAlt
} from 'react-icons/fa';
import { format, isValid } from 'date-fns';

const InvestmentHistoryCard = ({ investment, type, onCancel, onWithdraw }) => {
  // Helper to format dates with validation
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };
  
  // Helper to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-500 border border-green-500">
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-500 border border-blue-500">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-500 border border-red-500">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/30 text-gray-400 border border-gray-500">
            {status}
          </span>
        );
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center">
            <div className="bg-primary-900/30 p-2 rounded-full mr-3">
              <FaChartLine className="text-primary-500" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-100">{investment.planName}</h3>
              <p className="text-sm text-gray-400">ID: {investment.id}</p>
            </div>
          </div>
          <div className="mt-2 sm:mt-0">
            {getStatusBadge(investment.status)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <FaMoneyBillWave className="mr-1" size={12} />
              <span>INVESTMENT</span>
            </div>
            <div className="text-base font-bold text-gray-100">${investment.amount.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <FaPercent className="mr-1" size={12} />
              <span>ROI</span>
            </div>
            <div className="text-base font-bold text-primary-500">{investment.roi}%</div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <FaCalendarDay className="mr-1" size={12} />
              <span>START DATE</span>
            </div>
            <div className="text-base font-bold text-gray-100">{formatDate(investment.startDate)}</div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <FaCalendarCheck className="mr-1" size={12} />
              <span>{investment.status === 'active' ? 'END DATE' : 'COMPLETED DATE'}</span>
            </div>
            <div className="text-base font-bold text-gray-100">{formatDate(investment.endDate)}</div>
          </div>
        </div>
        
        {type === 'active' && (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{investment.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${investment.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center text-gray-400 text-xs mb-1">
                  <FaMoneyBillAlt className="mr-1" size={12} />
                  <span>CURRENT VALUE</span>
                </div>
                <div className="text-base font-bold text-green-500">${investment.currentValue.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center text-gray-400 text-xs mb-1">
                  <FaChartLine className="mr-1" size={12} />
                  <span>EXPECTED RETURN</span>
                </div>
                <div className="text-base font-bold text-gray-100">
                  ${investment.expectedReturn.toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
        
        {type === 'history' && investment.status === 'completed' && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center text-gray-200 mb-1">
              <FaMoneyBillAlt className="mr-2" size={14} />
              <span className="font-medium">Return Amount</span>
            </div>
            <div className="text-lg font-bold text-green-500">
              +${investment.returnAmount.toLocaleString()}
            </div>
          </div>
        )}
        
        {type === 'history' && investment.status === 'cancelled' && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center text-red-300">
              <FaBan className="mr-2" size={14} />
              <span>This investment was cancelled before completion.</span>
            </div>
          </div>
        )}
        
        {type === 'active' && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={onWithdraw}
              className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center"
            >
              <FaMoneyBillAlt className="mr-2 hidden sm:inline" />
              <span className="whitespace-nowrap text-sm sm:text-base">Withdraw Now</span>
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
            >
              <FaBan className="mr-2 hidden sm:inline" />
              <span className="whitespace-nowrap text-sm sm:text-base">Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

InvestmentHistoryCard.propTypes = {
  investment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    planId: PropTypes.string.isRequired,
    planName: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    roi: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    
    // Active investment properties
    progress: PropTypes.number,
    currentValue: PropTypes.number,
    expectedReturn: PropTypes.number,
    
    // Completed investment properties
    returnAmount: PropTypes.number
  }).isRequired,
  type: PropTypes.oneOf(['active', 'history']).isRequired,
  onCancel: PropTypes.func,
  onWithdraw: PropTypes.func
};

InvestmentHistoryCard.defaultProps = {
  onCancel: () => {},
  onWithdraw: () => {}
};

export default InvestmentHistoryCard;
