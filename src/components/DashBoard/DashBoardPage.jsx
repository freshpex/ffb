import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardData,
  fetchFinancialHighlights, 
  fetchMarketPulse,
  selectDashboardStatus,
  selectDashboardError
} from '../../redux/slices/dashboardSlice';

import DashboardLayout from './Layout/DashboardLayout';
import AccountSummary from './AccountSummary';
import RecentTransactions from './Transaction/RecentTransactions';
import InvestmentSummary from './Investment/InvestmentSummary';
import FinancialHighlights from './FinancialHighlights';
import MarketPulse from './MarketPulse';
import MarketNews from './MarketNews';
import PriceAlerts from './PriceAlerts';
import QuickActions from './QuickActions';
import NotificationsPanel from './Layout/NotificationsPanel';
import AssetCards from '../trading/AssetCards';

const DashBoardPage = () => {
  const dispatch = useDispatch();
  
  const dashboardStatus = useSelector(state => selectDashboardStatus(state, 'dashboard'));
  const financialHighlightsStatus = useSelector(state => selectDashboardStatus(state, 'financialHighlights'));
  const marketPulseStatus = useSelector(state => selectDashboardStatus(state, 'marketPulse'));
  
  const dashboardError = useSelector(state => selectDashboardError(state, 'dashboard'));
  
  useEffect(() => {
    // Fetch initial dashboard data (includes accountSummary, recentTransactions, priceAlerts, and latestNews)
    dispatch(fetchDashboardData());
    
    // Fetch additional data that isn't part of the main dashboard endpoint
    dispatch(fetchFinancialHighlights());
    dispatch(fetchMarketPulse());
    
    // Set up periodic refresh (every 60 seconds)
    const refreshInterval = setInterval(() => {
      dispatch(fetchDashboardData());
      dispatch(fetchMarketPulse());
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, [dispatch]);
  
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        {dashboardError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>Error loading dashboard data: {dashboardError}</p>
            <button 
              onClick={() => dispatch(fetchDashboardData())}
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Account Summary */}
            <AccountSummary />

            {/* Asset Cards / Wallet */}
            <AssetCards />
            
            {/* Financial Highlights */}
            <FinancialHighlights />
            
            {/* Quick Actions */}
            <QuickActions />
            
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
