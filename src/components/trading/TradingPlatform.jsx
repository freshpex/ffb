import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSync } from 'react-icons/fa';
import {
  fetchTradingPairs,
  fetchMarketData,
  fetchOrderbook,
  fetchPortfolio,
  fetchOrders,
  fetchTradingHistory,
  cancelOrder,
  setActiveTab,
  setShowSidebar,
  clearAlert,
  selectSelectedSymbol,
  selectActiveTab,
  selectShowSidebar,
  selectShowAlert,
  selectAlertMessage,
  selectTradingStatus
} from '../../redux/slices/tradingSlice';
import DashboardLayout from '../DashBoard/Layout/DashboardLayout';
import Alert from '../common/Alert';
import TradingViewWidget from './TradingViewWidget';
import LiveOrderbook from './LiveOrderbook';
import MarketDepthChart from './MarketDepthChart';
import AssetSelector from './AssetSelector';
import OrderForm from './OrderForm';
import OrderHistory from './OrderHistory';
import PositionsTable from './PositionsTable';

const TradingPlatform = () => {
  const dispatch = useDispatch();

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTradingPairs());
    dispatch(fetchPortfolio());
    dispatch(fetchOrders());
    dispatch(fetchTradingHistory());
  }, [dispatch]);

  // Redux state 
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const activeTab = useSelector(selectActiveTab);
  const showSidebar = useSelector(selectShowSidebar);
  const showAlert = useSelector(selectShowAlert);
  const alertMessage = useSelector(selectAlertMessage);
  // tradingStatus is not used in this component

  useEffect(() => {
    dispatch(setActiveTab('positions'));
  }, [dispatch]);
  
  // For mobile responsiveness
  const isMobile = window.innerWidth < 1024;
  
  // Fetch symbol-specific data
  useEffect(() => {
    if (!selectedSymbol) return;
    dispatch(fetchMarketData(selectedSymbol));
    dispatch(fetchOrderbook(selectedSymbol));
  }, [dispatch, selectedSymbol]);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const renderSidebar = () => (
    <div className={`bg-gray-800 ${isMobile ? 'fixed inset-y-0 left-0 z-30 w-80 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col' : 'rounded-lg p-4'} ${
      showSidebar ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {isMobile && (
        <div className="flex justify-end p-4 sticky top-0 bg-gray-800 z-10">
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => dispatch(setShowSidebar(false))}
          >
            <FaTimes size={24} />
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'overflow-y-auto flex-1 p-4 pb-20' : ''}`}>
        <div className="mb-6">
          <AssetSelector variant="full" />
        </div>

        <div className="mb-6">
          <OrderForm />
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex border-b border-gray-700 mb-4">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'positions'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => dispatch(setActiveTab('positions'))}
            >
              Positions
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'orders'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => dispatch(setActiveTab('orders'))}
            >
              Open Orders
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'history'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => dispatch(setActiveTab('history'))}
            >
              History
            </button>
          </div>

          {activeTab === 'positions' && (
            <PositionsTable onCancelOrder={handleCancelOrder} />
          )}
          
          {activeTab === 'orders' && (
            <OrderHistory 
              showOrders={true} 
              showHistory={false}
              onCancelOrder={handleCancelOrder}
            />
          )}
          
          {activeTab === 'history' && (
            <OrderHistory 
              showOrders={false} 
              showHistory={true}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderTradingView = () => (
    <div className="rounded-lg overflow-hidden bg-gray-800">
      <div className="h-[500px]">
        <TradingViewWidget symbol={selectedSymbol} />
      </div>
    </div>
  );

  const renderMarketData = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-800 rounded-lg overflow-hidden h-[400px]">
        <LiveOrderbook symbol={selectedSymbol} />
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden h-[400px]">
        <MarketDepthChart symbol={selectedSymbol} />
      </div>
    </div>
  );

  const renderRecentTrades = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white">Recent Trades</h3>
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => dispatch(fetchTradingHistory())}
        >
          <FaSync size={14} />
        </button>
      </div>
      <div className="p-0">
        <OrderHistory 
          showRecentTradesOnly={true}
          maxItems={10}
          compact={false}
          showHeading={false}
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Trading Platform</h1>

          {isMobile && (
            <button
              className="self-end bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => dispatch(setShowSidebar(true))}
            >
              <FaBars className="mr-2" /> Trading Menu
            </button>
          )}
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                type={alertMessage.type}
                message={alertMessage.message}
                onDismiss={() => dispatch(clearAlert())}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Trading sidebar - fixed on mobile, inline on desktop */}
          {isMobile ? (
            <div className="lg:col-span-1">
              {showSidebar && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-20"
                  onClick={() => dispatch(setShowSidebar(false))}
                ></div>
              )}
              {renderSidebar()}
            </div>
          ) : (
            <div className="lg:col-span-1">
              {renderSidebar()}
            </div>
          )}

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-4">
            {renderTradingView()}
            {renderMarketData()}
            {renderRecentTrades()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradingPlatform;
