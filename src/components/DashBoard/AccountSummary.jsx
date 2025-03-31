import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaExchangeAlt, FaWallet, FaChartLine, FaArrowUp, FaArrowDown, FaQuestionCircle } from 'react-icons/fa';
import { selectUserProfile } from '../../redux/slices/userSlice';
import { selectAccountBalance, selectAccountActivity, fetchAccountSummary } from '../../redux/slices/dashboardSlice';
import Loader from '../common/Loader';

const AccountSummary = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const accountBalance = useSelector(selectAccountBalance);
  const accountActivity = useSelector(selectAccountActivity);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchAccountSummary());
      } catch (error) {
        console.error("Failed to fetch account summary", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);
  
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  
  // Add proper null/undefined checks using optional chaining and default values
  const accountNumber = userProfile?.accountNumber || 'XXXX-XXXX-XXXX';
  const userName = userProfile?.fullName || 'User';
  const currentBalance = accountBalance?.current || 0;
  const availableBalance = accountBalance?.available || 0;
  const pendingBalance = accountBalance?.pending || 0;
  
  // Get activity stats (with safe defaults)
  const deposits = accountActivity?.deposits || 0;
  const withdrawals = accountActivity?.withdrawals || 0;
  const trades = accountActivity?.trades || 0;
  
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
        </div>
      </div>
      
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-lg font-semibold">Current Balance</h3>
          <FaWallet className="text-white/70" />
        </div>
        
        <p className="text-3xl font-bold text-white mb-4">
          {showBalance ? `$${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$•••••.••'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-white/70 text-sm">Available Balance</p>
            <p className="text-white font-semibold">
              {showBalance ? `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$•••••.••'}
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Pending Balance</p>
            <p className="text-white font-semibold">
              {showBalance ? `$${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$•••••.••'}
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
            <p className="text-gray-400 text-xs">Deposits (30d)</p>
            <p className="text-white font-semibold">{deposits}</p>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-red-600/20 p-3 rounded-lg mr-3">
            <FaArrowUp className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Withdrawals (30d)</p>
            <p className="text-white font-semibold">{withdrawals}</p>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-blue-600/20 p-3 rounded-lg mr-3">
            <FaExchangeAlt className="text-blue-500" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Trades (30d)</p>
            <p className="text-white font-semibold">{trades}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
