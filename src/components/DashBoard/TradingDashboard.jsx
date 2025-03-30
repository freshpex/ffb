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
import TradingChart from './Trading/TradingChart';
import OrderForm from './Trading/OrderForm';
import TradingHeader from './Trading/TradingHeader';
import { 
  FaChartLine, 
  FaExchangeAlt, 
  FaBook, 
  FaHistory, 
  FaWallet, 
  FaArrowUp, 
  FaArrowDown,
  FaGlobeAmericas,
  FaStar,
  FaChartBar
} from 'react-icons/fa';
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
      try {
        setIsLoading(true);
        
        // Fetch initial data in parallel
        await Promise.all([
          dispatch(fetchMarketData(selectedAsset)),
          dispatch(fetchChartData(selectedAsset, timeframe)),
          dispatch(fetchPortfolio()),
          dispatch(fetchOrders()),
          dispatch(fetchTradingHistory())
        ]);
        
        // Set up data refresh interval
        const intervalId = setInterval(() => {
          dispatch(fetchMarketData(selectedAsset));
        }, 5000);
        
        setIsLoading(false);
        
        // Clean up interval on unmount
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error('Error loading trading data:', error);
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
    if (price < 1) return price.toFixed(8);
    if (price < 10) return price.toFixed(6);
    if (price < 1000) return price.toFixed(4);
    return price.toFixed(2);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader size="xl" />
          <p className="mt-4 text-gray-400 text-lg">Loading Trading Platform...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      {/* Trading Header */}
      <TradingHeader />
      
      {/* Main Trading Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-150px)] overflow-hidden">
        {/* Main Panel */}
        <div className="flex-grow overflow-hidden flex flex-col">
          {/* Tabs for Mobile */}
          <div className="lg:hidden px-4 pt-3">
            <div className="flex bg-gray-800 rounded-lg p-1 mb-3">
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  activeTab === 'chart' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('chart')}
              >
                <FaChartLine className="mr-2" /> Chart
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  activeTab === 'orderbook' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('orderbook')}
              >
                <FaBook className="mr-2" /> Orderbook
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  activeTab === 'trades' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('trades')}
              >
                <FaHistory className="mr-2" /> Trades
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  activeTab === 'orders' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <FaExchangeAlt className="mr-2" /> Orders
              </button>
            </div>
          </div>
          
          {/* Mobile Side Panel Tabs */}
          <div className="lg:hidden px-4 pb-3">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  activeSideTab === 'order' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveSideTab('order')}
              >
                <FaExchangeAlt className="mr-2" /> Order
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  activeSideTab === 'markets' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveSideTab('markets')}
              >
                <FaGlobeAmericas className="mr-2" /> Markets
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  activeSideTab === 'watchlist' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveSideTab('watchlist')}
              >
                <FaStar className="mr-2" /> Watchlist
              </button>
            </div>
          </div>
          
          {/* Mobile: Order Form */}
          {(activeTab === 'chart' && activeSideTab === 'order') && (
            <div className="lg:hidden px-4 pb-4">
              <OrderForm />
            </div>
          )}
          
          {/* Price Ticker Bar */}
          <div className="flex items-center bg-gray-800 px-4 py-3 border-b border-gray-700">
            <div className="flex items-center mr-4">
              <h2 className="text-xl font-bold text-white mr-2">{selectedAsset}</h2>
              <div className={`px-2 py-0.5 rounded text-sm font-medium ${
                isPriceUp ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'
              }`}>
                {isPriceUp ? <FaArrowUp className="inline mr-1" size={10} /> : <FaArrowDown className="inline mr-1" size={10} />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-400">Last Price</p>
                <p className={`text-lg font-bold ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                  ${formatPrice(currentPrice)}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">24h Change</p>
                <p className={`text-sm font-medium ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isPriceUp ? '+' : ''}{priceChange.toFixed(2)}%
                </p>
              </div>
              
              <div className="hidden md:block">
                <p className="text-xs text-gray-400">24h High</p>
                <p className="text-sm font-medium text-white">
                  ${formatPrice(marketPrices[selectedAsset]?.high24h || 0)}
                </p>
              </div>
              
              <div className="hidden md:block">
                <p className="text-xs text-gray-400">24h Low</p>
                <p className="text-sm font-medium text-white">
                  ${formatPrice(marketPrices[selectedAsset]?.low24h || 0)}
                </p>
              </div>
              
              <div className="hidden md:block">
                <p className="text-xs text-gray-400">24h Volume</p>
                <p className="text-sm font-medium text-white">
                  ${(marketPrices[selectedAsset]?.volume24h || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Chart Container */}
          <div className="flex-grow">
            <TradingChart />
          </div>
          
          {/* Position Summary Bar */}
          <div className="bg-gray-800 border-t border-gray-700 p-4 hidden md:block">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400">Account Balance</p>
                <p className="text-lg font-semibold text-white">
                  ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Available Margin</p>
                <p className="text-lg font-semibold text-white">
                  ${marginAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Open Positions</p>
                <p className="text-lg font-semibold text-white">
                  {positions.length}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Pending Orders</p>
                <p className="text-lg font-semibold text-white">
                  {openOrders.length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Side Panel (Desktop only) */}
        <div className="hidden lg:flex w-96 flex-shrink-0 flex-col border-l border-gray-700">
          {/* Tabs */}
          <div className="flex bg-gray-800 p-1 m-3 rounded-lg">
            <button 
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                activeSideTab === 'order' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveSideTab('order')}
            >
              <FaExchangeAlt className="inline mr-1" /> Order
            </button>
            <button 
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                activeSideTab === 'markets' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveSideTab('markets')}
            >
              <FaGlobeAmericas className="inline mr-1" /> Markets
            </button>
            <button 
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                activeSideTab === 'watchlist' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveSideTab('watchlist')}
            >
              <FaStar className="inline mr-1" /> Watchlist
            </button>
          </div>
          
          {activeSideTab === 'order' && (
            <div className="px-3 pb-3 overflow-y-auto">
              <OrderForm />
            </div>
          )}
          
          {activeSideTab === 'markets' && (
            <div className="px-3 pb-3 overflow-y-auto">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <FaGlobeAmericas className="mr-2 text-primary-500" /> Markets
                </h3>
                
                <div className="space-y-1">
                  {/* Placeholder for markets list */}
                  <p className="text-sm text-gray-400">Markets component will go here</p>
                </div>
              </div>
            </div>
          )}
          
          {activeSideTab === 'watchlist' && (
            <div className="px-3 pb-3 overflow-y-auto">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <FaStar className="mr-2 text-primary-500" /> Watchlist
                </h3>
                
                <div className="space-y-1">
                  {/* Placeholder for watchlist */}
                  <p className="text-sm text-gray-400">Watchlist component will go here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradingDashboard;
