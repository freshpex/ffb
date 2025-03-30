import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMarketData, 
  fetchChartData, 
  fetchPortfolio, 
  fetchOrders,
  fetchTradingHistory,
  selectSelectedAsset,
  selectMarketPrices,
  selectPositions,
  selectAccountBalance,
  selectMarginAvailable,
  selectOpenOrders,
  selectChartTimeframe
} from '../../redux/slices/tradingSlice';
import DashboardLayout from './DashboardLayout';
import TradingHeader from './Trading/TradingHeader';
import TradingChart from './Trading/TradingChart';
import OrderForm from './Trading/OrderForm';
import Loader from '../common/Loader';

const TradingDashboard = () => {
  const dispatch = useDispatch();
  const selectedAsset = useSelector(selectSelectedAsset);
  const marketPrices = useSelector(selectMarketPrices);
  const positions = useSelector(selectPositions);
  const accountBalance = useSelector(selectAccountBalance);
  const marginAvailable = useSelector(selectMarginAvailable);
  const openOrders = useSelector(selectOpenOrders);
  const timeframe = useSelector(selectChartTimeframe);
  
  const [activeTab, setActiveTab] = useState('chart');
  const [activeSideTab, setActiveSideTab] = useState('order');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        await Promise.all([
          dispatch(fetchMarketData(selectedAsset)),
          dispatch(fetchChartData({ symbol: selectedAsset, timeframe })),
          dispatch(fetchPortfolio()),
          dispatch(fetchOrders()),
          dispatch(fetchTradingHistory())
        ]);
      } catch (error) {
        console.error("Error loading trading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch, selectedAsset, timeframe]);
  
  // Get current price and price change
  const currentPrice = marketPrices[selectedAsset]?.current || 0;
  const priceChange = marketPrices[selectedAsset]?.change || 0;
  const isPriceUp = priceChange >= 0;
  
  // Format price with appropriate decimal places
  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (price < 1) return price.toFixed(6);
    if (price < 10) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return price.toFixed(2);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          {/* Fixed from lg to large */}
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
                  onClick={() => setActiveTab('chart')}
                >
                  Chart
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'orderbook' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('orderbook')}
                >
                  Order Book
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'trades' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('trades')}
                >
                  Trades
                </button>
              </div>
              
              <div className="flex-grow">
                {activeTab === 'chart' && <TradingChart />}
                {activeTab === 'orderbook' && <div className="p-4">Order Book Component</div>}
                {activeTab === 'trades' && <div className="p-4">Recent Trades Component</div>}
              </div>
            </div>
          </div>
          
          {/* Sidebar - order form, positions, orders */}
          <div className="col-span-12 lg:col-span-3 border-l border-gray-700 bg-gray-900 h-full overflow-auto">
            <div className="flex items-center border-b border-gray-700">
              <button
                className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
                  activeSideTab === 'order' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveSideTab('order')}
              >
                Order
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
                  activeSideTab === 'positions' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveSideTab('positions')}
              >
                Positions
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
                  activeSideTab === 'orders' ? 'text-white border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveSideTab('orders')}
              >
                Orders
              </button>
            </div>
            
            <div className="p-4">
              {activeSideTab === 'order' && <OrderForm />}
              {activeSideTab === 'positions' && <div>Positions Component</div>}
              {activeSideTab === 'orders' && <div>Open Orders Component</div>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradingDashboard;
