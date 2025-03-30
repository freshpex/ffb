import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';
import AccountSummary from './AccountSummary';
import RecentTransactions from './RecentTransactions';
import InvestmentSummary from './InvestmentSummary';
import MarketOverview from './MarketOverview';
import QuickActions from './QuickActions';
import PriceAlerts from './PriceAlerts';
import FinancialHighlights from './FinancialHighlights';
import MarketNews from './MarketNews';
import MarketPulse from './MarketPulse';
import { 
  fetchDashboardData, 
  selectDashboardStatus 
} from '../../redux/slices/dashboardSlice';
import NotificationsPanel from './NotificationsPanel';

const DashBoardPage = () => {
  const dispatch = useDispatch();
  const dashboardStatus = useSelector(selectDashboardStatus);

  useEffect(() => {
    // Load dashboard data when component mounts
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Dashboard</h1>
        
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Account Summary */}
            <AccountSummary />
            
            {/* Financial Highlights */}
            <FinancialHighlights />
            
            {/* Quick Actions */}
            <QuickActions />
            
            {/* Market Overview */}
            <MarketOverview />
            
            {/* Market Pulse - visible only on desktop */}
            <div className="hidden lg:block">
              <MarketPulse />
            </div>
            
            {/* Recent Transactions */}
            <RecentTransactions />
          </div>
          
          {/* Sidebar Column */}
          <div className="space-y-4 lg:space-y-6">
            {/* Investment Summary */}
            <InvestmentSummary />
            
            {/* Price Alerts */}
            <PriceAlerts />
            
            {/* Market News */}
            <MarketNews maxItems={3} />
            
            {/* Market Pulse - visible only on mobile */}
            <div className="lg:hidden">
              <MarketPulse />
            </div>
            
            {/* Notifications */}
            <NotificationsPanel maxItems={3} showViewAll />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashBoardPage;
