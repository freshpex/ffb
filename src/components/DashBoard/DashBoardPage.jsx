import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserAuth } from "../AuthPage/AuthContext";
import { motion } from "framer-motion";
import TradingViewWidget from "./TradingViewWidget";
import AdvancedTradingView from "./AdvancedTradingView";
import DashBoardData from "./DashBoardData";
import MarketOverview from "./MarketOverview";
import MarketPulse from "./MarketPulse";
import MarketNews from "./MarketNews";
import FinancialHighlights from "./FinancialHighlights";
import Loader from "../common/Loader";
import InfoCard from "../common/InfoCard";
import DashboardLayout from "./DashboardLayout";
import { 
  FaWallet, 
  FaChartLine, 
  FaRegCalendarAlt 
} from "react-icons/fa";
import { fetchDashboardData, selectAccountStats } from "../../redux/slices/dashboardSlice";

const DashBoardPage = () => {
  const { user } = UserAuth();
  const dispatch = useDispatch();
  
  const accountStats = useSelector(selectAccountStats) || { 
    balance: 0, 
    earnings: 0, 
    registered: new Date().toISOString() 
  };
  
  const [isLoading, setIsLoading] = useState(true);
  const [useAdvancedChart, setUseAdvancedChart] = useState(true);
  
  useEffect(() => {
    // Fetch data from redux
    dispatch(fetchDashboardData());
    
    // Simulate loading delay
    const delay = 2000;
    const preloaderTimeout = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    // Clean up
    return () => clearTimeout(preloaderTimeout);
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Trading Widget with toggle option */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Market Chart</h2>
            <button 
              onClick={() => setUseAdvancedChart(!useAdvancedChart)}
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {useAdvancedChart ? "Simple View" : "Advanced View"}
            </button>
          </div>
          <div className="w-full" style={{ height: useAdvancedChart ? '600px' : '400px' }}>
            {useAdvancedChart ? <AdvancedTradingView /> : <TradingViewWidget />}
          </div>
        </div>
        
        {/* Market Pulse */}
        <MarketPulse />
        
        {/* Market Overview */}
        <MarketOverview />
        
        {/* Market News Feed */}
        <MarketNews />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={<FaWallet size={22} />}
            title="Account Balance"
            value={`$${accountStats.balance.toFixed(2)}`}
            color="blue"
            delay={0.1}
          />
          
          <InfoCard
            icon={<FaChartLine size={22} />}
            title="Total Earnings"
            value={`$${accountStats.earnings.toFixed(2)}`}
            color="green"
            delay={0.2}
          />
          
          <InfoCard
            icon={<FaRegCalendarAlt size={22} />}
            title="Registered Date"
            value={formatDate(accountStats.registered)}
            color="amber"
            delay={0.3}
          />
        </div>
        
        {/* Financial Highlights */}
        <FinancialHighlights />
        
        {/* Recent Transactions */}
        <DashBoardData />
      </div>
    </DashboardLayout>
  );
};

export default DashBoardPage;
