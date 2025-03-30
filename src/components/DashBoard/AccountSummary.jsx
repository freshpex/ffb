import { useSelector } from 'react-redux';
import { 
  FaMoneyBillWave, 
  FaArrowUp, 
  FaArrowDown, 
  FaChartLine, 
  FaExchangeAlt 
} from 'react-icons/fa';
import { 
  selectUserBalance,
  selectUserProfile 
} from '../../redux/slices/userSlice';
import { 
  selectDashboardData, 
  selectDashboardComponentStatus 
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';

const AccountSummary = () => {
  const balance = useSelector(selectUserBalance);
  const profile = useSelector(selectUserProfile);
  const dashboardData = useSelector(selectDashboardData);
  const componentStatus = useSelector(state => 
    selectDashboardComponentStatus(state, 'accountSummary')
  );

  // If the component is loading, show a skeleton loader
  if (componentStatus === 'loading') {
    return <CardLoader title="Account Summary" height="h-64" />;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Account Summary</h2>
        <span className="text-xs text-gray-400">Last updated: {new Date().toLocaleString()}</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Balance Card */}
        <div className="bg-gray-700/50 p-4 rounded-lg flex-1">
          <div className="flex items-center">
            <div className="p-2 bg-primary-900/30 rounded-full mr-3">
              <FaMoneyBillWave className="text-primary-500" size={16} />
            </div>
            <p className="text-sm text-gray-400">Available Balance</p>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-1">${balance.toLocaleString()}</p>
          
          <div className="mt-2 text-xs flex justify-between text-gray-400">
            <span>Account ID: {profile.accountNumber || '********'}</span>
            <span>{profile.accountType || 'Trading Account'}</span>
          </div>
        </div>
      </div>
      
      {/* Financial Activity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-400">
            <FaArrowUp className="text-green-500 mr-1" />
            <span>Income</span>
          </div>
          <p className="font-semibold text-gray-100">
            ${dashboardData?.incomingTotal?.toLocaleString() || '0.00'}
          </p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-400">
            <FaArrowDown className="text-red-500 mr-1" />
            <span>Expenses</span>
          </div>
          <p className="font-semibold text-gray-100">
            ${dashboardData?.outgoingTotal?.toLocaleString() || '0.00'}
          </p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-400">
            <FaChartLine className="text-blue-500 mr-1" />
            <span>Investments</span>
          </div>
          <p className="font-semibold text-gray-100">
            ${dashboardData?.investmentsTotal?.toLocaleString() || '0.00'}
          </p>
        </div>
        
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-400">
            <FaExchangeAlt className="text-purple-500 mr-1" />
            <span>Trades</span>
          </div>
          <p className="font-semibold text-gray-100">
            {dashboardData?.tradesCount || '0'} <span className="text-xs text-gray-400">this month</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
