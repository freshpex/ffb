import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMarketData,
  fetchOrderbook,
  fetchHistoricalData,
  fetchPortfolio,
  fetchOrders,
  fetchTradingHistory,
  setActiveTab,
  setMarketSideTab,
  selectSelectedSymbol,
  selectActiveTab,
  selectMarketSideTab,
  selectTradingStatus
} from '../../redux/slices/tradingSlice';
import DashboardLayout from '../DashBoard/Layout/DashboardLayout';
import TradingHeader from './TradingHeader';
import SimpleTradingChart from './SimpleTradingChart';
import OrderForm from './OrderForm';
import LiveOrderbook from './LiveOrderbook';
import PositionsTable from './PositionsTable';
import OrderHistory from './OrderHistory';
import AssetSelector from './AssetSelector';
import AssetCards from './AssetCards';
import Loader from '../common/Loader';

const TradingDashboard = () => {
  const dispatch = useDispatch();
  
  // Use Redux selectors instead of directly accessing state
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const activeTab = useSelector(selectActiveTab);
  const activeSideTab = useSelector(selectMarketSideTab);
  const tradingStatus = useSelector(selectTradingStatus);
  const isLoading = tradingStatus === 'loading';

  useEffect(() => {
    dispatch(setActiveTab('chart'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setMarketSideTab('assets'));
  }, [dispatch]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchMarketData(selectedSymbol)),
          dispatch(fetchHistoricalData({ symbol: selectedSymbol, timeframe: '1d' })),
          dispatch(fetchPortfolio()),
          dispatch(fetchOrders()),
          dispatch(fetchTradingHistory()),
          dispatch(fetchOrderbook(selectedSymbol))
        ]);
      } catch (error) {
        console.error("Error loading trading data:", error);
      }
    };
    
    loadData();
  }, [dispatch, selectedSymbol]);
  
  // Render loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader size="large" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <TradingHeader />
        
        <div className="flex-grow grid grid-cols-12 gap-0">
          {/* Main area - chart or order book */}
          <div className="col-span-12 lg:col-span-9 bg-gray-800 h-full">
            <div className="h-full flex flex-col">
              <div className="flex items-center border-b border-gray-700">
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'chart' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => dispatch(setActiveTab('chart'))}
                >
                  Chart
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'orderbook' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => dispatch(setActiveTab('orderbook'))}
                >
                  Order Book
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'trades' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => dispatch(setActiveTab('trades'))}
                >
                  Trades
                </button>
              </div>
              
              <div className="flex-grow">
                {activeTab === 'chart' && (
                  <div className="h-full">
                    <SimpleTradingChart />
                  </div>
                )}
                
                {activeTab === 'orderbook' && (
                  <div className="h-full">
                    <LiveOrderbook symbol={selectedSymbol} />
                  </div>
                )}
                
                {activeTab === 'trades' && (
                  <div className="h-full p-4">
                    <OrderHistory showRecentTradesOnly={true} maxItems={50} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar - order form, positions, orders */}
          <div className="col-span-12 lg:col-span-3 border-l border-gray-700 bg-gray-900 h-full overflow-auto">
            <div className="p-3">
              <AssetSelector variant="minimal" />
            </div>
            
            <div className="flex items-center border-b border-gray-700">
              <button
                className={`px-4 py-2 text-sm font-medium flex-1 text-center ${
                  activeSideTab === 'assets' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => dispatch(setMarketSideTab('assets'))}
              >
                Wallet
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium flex-1 text-center ${
                  activeSideTab === 'order' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => dispatch(setMarketSideTab('order'))}
              >
                Order
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium flex-1 text-center ${
                  activeSideTab === 'positions' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => dispatch(setMarketSideTab('positions'))}
              >
                Positions
              </button>
            </div>
            
            <div className="p-4">
              {activeSideTab === 'assets' && <AssetCards variant="compact" maxItems={5} />}
              {activeSideTab === 'order' && <OrderForm compact={true} />}
              {activeSideTab === 'positions' && <PositionsTable compact={true} />}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradingDashboard;
