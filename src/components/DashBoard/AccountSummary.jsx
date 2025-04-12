import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaExchangeAlt, FaWallet, FaChartLine, FaArrowUp, FaArrowDown, FaQuestionCircle } from 'react-icons/fa';
import { selectUserProfile } from '../../redux/slices/userSlice';
import { 
  fetchAccountSummary, 
  selectAccountSummary,
  selectAccountActivity, 
  selectAccountBalanceHistory,
  selectAccountOverview,
  selectDashboardStatus
} from '../../redux/slices/dashboardSlice';
import Loader from '../common/Loader';

const AccountSummary = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const accountSummary = useSelector(selectAccountSummary);
  console.log("accountSummary", accountSummary)
  const accountActivity = useSelector(selectAccountActivity);
  const dashboardStatus = useSelector(state => selectDashboardStatus(state, 'accountSummary'));
  
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchAccountSummary());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);
  
  // Determine if we're still loading the data
  const loading = isLoading || dashboardStatus === 'loading';
  
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  
  // Add proper null/undefined checks using optional chaining and default values
  const accountNumber = userProfile?.accountNumber || accountSummary?.accountNumber || 'XXXX-XXXX-XXXX';
  const userName = userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : 'User';
  const accountType = accountSummary?.accountType || 'Standard';
  
  // Get balance information with proper fallbacks
  const availableBalance = accountSummary?.balance || 0;
  const totalInvestments = accountSummary?.investmentTotal || 0;
  const totalAssets = accountSummary?.totalAssets || availableBalance + totalInvestments;
  const pendingBalance = 0; // Add this if your API provides it
  
  // Get activity stats (with safe defaults)
  const totalDeposits = accountSummary?.depositTotal || 0;
  const totalWithdrawals = accountSummary?.withdrawalTotal || 0;
  const trades = accountActivity?.trades || 0;
  
  // Determine currency
  const currency = accountSummary?.currency || 'USD';
  
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Account Summary</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            {showBalance ? <FaEyeSlash /> : <FaEye />}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white">
            <FaQuestionCircle />
          </button>
        </div>
      </div>
      
      {/* Account Info */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Account Number</p>
            <p className="text-white font-medium">{accountNumber}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-gray-400 text-sm">Account Holder</p>
            <p className="text-white font-medium">{userName}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-gray-400 text-sm">Account Type</p>
            <p className="text-white font-medium">{accountType}</p>
          </div>
        </div>
      </div>
      
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-lg font-semibold">Current Balance</h3>
          <FaWallet className="text-white/70" />
        </div>
        
        <p className="text-3xl font-bold text-white mb-4">
          {showBalance ? `${currency}${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${currency}•••••.••`}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-white/70 text-sm">Total Assets</p>
            <p className="text-white font-semibold">
              {showBalance ? `${currency}${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${currency}•••••.••`}
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Total Investments</p>
            <p className="text-white font-semibold">
              {showBalance ? `${currency}${totalInvestments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${currency}•••••.••`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-green-600/20 p-3 rounded-lg mr-3">
            <FaArrowDown className="text-green-500" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Deposits (Total)</p>
            <p className="text-white font-semibold">{currency}{totalDeposits.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-red-600/20 p-3 rounded-lg mr-3">
            <FaArrowUp className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Withdrawals (Total)</p>
            <p className="text-white font-semibold">{currency}{totalWithdrawals.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-blue-600/20 p-3 rounded-lg mr-3">
            <FaExchangeAlt className="text-blue-500" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Projected Earnings</p>
            <p className="text-white font-semibold">{currency}{(accountSummary?.projectedEarnings || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
