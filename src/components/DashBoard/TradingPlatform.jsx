import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaChevronDown, 
  FaSync, 
  FaInfoCircle 
} from 'react-icons/fa';
import { 
  selectTradingPairs,
  selectSelectedAsset,
  selectPositions,
  selectOpenOrders,
  selectTradeHistory,
  selectOrderBook,
  selectRecentTrades,
  selectTradingStatus,
  selectTradingError,
  selectUserBalance,
  selectMarketPrices,
  setSelectedPair,
  cancelOrder,
  placeOrder,
  updateMarketPrices
} from '../../redux/slices/tradingSlice';
import DashboardLayout from './DashboardLayout';
import Button from '../common/Button';
import Alert from '../common/Alert';
import TradingViewWidget from './TradingViewWidget';
import LiveOrderbook from './LiveOrderbook';
import MarketDepthChart from './MarketDepthChart';

const TradingPlatform = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const tradingPairs = useSelector(selectTradingPairs);
  const selectedPair = useSelector(selectSelectedAsset);
  const positions = useSelector(selectPositions);
  const openOrders = useSelector(selectOpenOrders);
  const tradeHistory = useSelector(selectTradeHistory);
  const orderBook = useSelector(selectOrderBook);
  const recentTrades = useSelector(selectRecentTrades);
  const tradingStatus = useSelector(selectTradingStatus);
  const tradingError = useSelector(selectTradingError);
  const userBalance = useSelector(selectUserBalance);
  const marketPrices = useSelector(selectMarketPrices);
  
  // Initialize with a default value if selectedPair is undefined
  const defaultPair = 'BTC/USD';
  const currentSelectedPair = selectedPair || defaultPair;
  
  // Local state
  const [orderForm, setOrderForm] = useState({
    type: 'limit', // 'limit', 'market', 'stop'
    side: 'buy', // 'buy', 'sell'
    amount: '',
    price: '',
    stopPrice: '',
    total: ''
  });
  const [activeTab, setActiveTab] = useState('positions'); // 'positions', 'orders', 'history'
  const [marketSideTab, setMarketSideTab] = useState('buy'); // 'buy', 'sell'
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Get the current selected pair information
  const selectedPairInfo = tradingPairs.find(pair => pair.symbol === currentSelectedPair) || 
    { symbol: currentSelectedPair, lastPrice: 0, priceChange: 0 };
  const currentPairPrice = marketPrices[currentSelectedPair]?.current || 65000;
  const priceChange = marketPrices[currentSelectedPair]?.change || 0;
  
  // Initialize with a default pair if needed
  useEffect(() => {
    if (!selectedPair && tradingPairs.length > 0) {
      dispatch(setSelectedPair(defaultPair));
    }
  }, [dispatch, selectedPair, tradingPairs]);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && !showSidebar) {
        setShowSidebar(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);
  
  // Simulate market price updates
  useEffect(() => {
    if (!selectedPair) return;
    
    const interval = setInterval(() => {
      const randomChange = (Math.random() * 0.002) - 0.001; // -0.1% to +0.1%
      const newPrice = selectedPair.lastPrice * (1 + randomChange);
      
      dispatch(updateMarketPrices({
        symbol: selectedPair.symbol,
        price: newPrice,
        priceChange: selectedPair.priceChange + (randomChange * 100)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [dispatch, selectedPair]);
  
  const handleSelectPair = (symbol) => {
    dispatch(setSelectedPair(symbol));
    setDropdownOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newOrderForm = { ...orderForm, [name]: value };
    
    // Auto-calculate total for limit and stop orders
    if ((name === 'amount' || name === 'price') && 
        (orderForm.type === 'limit' || orderForm.type === 'stop')) {
      const amount = parseFloat(newOrderForm.amount) || 0;
      const price = parseFloat(newOrderForm.price) || 0;
      newOrderForm.total = (amount * price).toFixed(2);
    }
    
    setOrderForm(newOrderForm);
    setError('');
  };
  
  const validateOrderForm = () => {
    if (!orderForm.amount || isNaN(parseFloat(orderForm.amount)) || parseFloat(orderForm.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (orderForm.type !== 'market') {
      if (!orderForm.price || isNaN(parseFloat(orderForm.price)) || parseFloat(orderForm.price) <= 0) {
        setError('Please enter a valid price');
        return false;
      }
    }
    
    if (orderForm.type === 'stop' && 
        (!orderForm.stopPrice || isNaN(parseFloat(orderForm.stopPrice)) || parseFloat(orderForm.stopPrice) <= 0)) {
      setError('Please enter a valid stop price');
      return false;
    }
    
    // Check if the user has enough balance for buy orders
    if (orderForm.side === 'buy') {
      const total = orderForm.type === 'market' 
        ? parseFloat(orderForm.amount) * (selectedPair?.lastPrice || 0)
        : parseFloat(orderForm.total);
      
      if (total > userBalance) {
        setError('Insufficient balance');
        return false;
      }
    }
    
    // Check if the user has enough of the asset for sell orders
    if (orderForm.side === 'sell') {
      const position = positions.find(pos => pos.symbol === selectedPair?.baseAsset);
      const amount = parseFloat(orderForm.amount);
      
      if (!position || position.amount < amount) {
        setError(`Insufficient ${selectedPair?.baseAsset || 'asset'} balance`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateOrderForm()) {
      return;
    }
    
    try {
      const orderData = {
        symbol: selectedPair.symbol,
        type: orderForm.type,
        side: orderForm.side,
        amount: parseFloat(orderForm.amount),
        price: orderForm.type === 'market' ? selectedPair.lastPrice : parseFloat(orderForm.price),
        stopPrice: orderForm.type === 'stop' ? parseFloat(orderForm.stopPrice) : undefined,
        total: parseFloat(orderForm.total || (orderForm.amount * (orderForm.type === 'market' ? selectedPair.lastPrice : orderForm.price)))
      };
      
      const result = await dispatch(placeOrder(orderData));
      
      if (result.success) {
        // Reset form
        setOrderForm({
          ...orderForm,
          amount: '',
          price: '',
          stopPrice: '',
          total: ''
        });
        
        setAlertMessage({
          type: 'success',
          message: `Order ${result.data.id} has been ${result.data.status}`
        });
        setShowAlert(true);
        
        // Hide alert after 5 seconds
        setTimeout(() => setShowAlert(false), 5000);
      }
    } catch (error) {
      setError(error.message || 'Failed to place order');
    }
  };
  
  const handleCancelOrder = async (orderId) => {
    try {
      const result = await dispatch(cancelOrder(orderId));
      
      if (result.success) {
        setAlertMessage({
          type: 'success',
          message: 'Order has been canceled'
        });
        setShowAlert(true);
        
        // Hide alert after 5 seconds
        setTimeout(() => setShowAlert(false), 5000);
      }
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: error.message || 'Failed to cancel order'
      });
      setShowAlert(true);
    }
  };
  
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '0.00';
    
    if (price >= 1000) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else if (price >= 0.01) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8);
    }
  };
  
  const formatPriceChange = (change) => {
    if (typeof change !== 'number') return '+0.00%';
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };
  
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const renderPairSelector = () => (
    <div className="relative">
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full md:w-64 flex items-center justify-between text-sm border border-gray-700"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="flex items-center">
          <span className="font-medium">{selectedPair.symbol}</span>
          <span className={`ml-2 text-xs ${selectedPair.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPriceChange(selectedPair.priceChange)}
          </span>
        </div>
        <FaChevronDown />
      </button>
      
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className="absolute z-20 mt-1 w-full md:w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-2">
              <input
                type="text"
                placeholder="Search pairs..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              />
            </div>
            <div className="divide-y divide-gray-700">
              {tradingPairs.map((pair) => (
                <button
                  key={pair.symbol}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center justify-between text-sm ${
                    selectedPair.symbol === pair.symbol ? 'bg-primary-500/10' : ''
                  }`}
                  onClick={() => handleSelectPair(pair.symbol)}
                >
                  <span className="font-medium text-white">{pair.symbol}</span>
                  <div className="text-right">
                    <div className="text-white">{formatPrice(pair.lastPrice)}</div>
                    <div className={`text-xs ${pair.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPriceChange(pair.priceChange)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  const renderSidebar = () => (
    <div className={`bg-gray-800 p-4 ${isMobile ? 'fixed inset-y-0 left-0 z-30 w-80 shadow-lg transform transition-transform duration-300 ease-in-out' : 'rounded-lg'} ${
      showSidebar ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {isMobile && (
        <div className="flex justify-end mb-4">
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setShowSidebar(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>
      )}
      
      <div className="mb-6">
        {renderPairSelector()}
      </div>
      
      <div className="p-4 bg-gray-900 rounded-lg mb-6">
        <div className="text-xs text-gray-400 mb-1">Last Price</div>
        <div className="flex items-baseline">
          <div className="text-2xl font-bold text-white mr-2">
            {formatPrice(selectedPair.lastPrice)}
          </div>
          <div className={`text-sm ${selectedPair.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPriceChange(selectedPair.priceChange)}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b border-gray-700 mb-4">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              orderForm.type === 'limit'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setOrderForm({ ...orderForm, type: 'limit' })}
          >
            Limit
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              orderForm.type === 'market'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setOrderForm({ ...orderForm, type: 'market' })}
          >
            Market
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              orderForm.type === 'stop'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setOrderForm({ ...orderForm, type: 'stop' })}
          >
            Stop
          </button>
        </div>
        
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-l-lg ${
              orderForm.side === 'buy'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => setOrderForm({ ...orderForm, side: 'buy' })}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-r-lg ${
              orderForm.side === 'sell'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => setOrderForm({ ...orderForm, side: 'sell' })}
          >
            Sell
          </button>
        </div>
        
        <form onSubmit={handleSubmitOrder}>
          {error && (
            <div className="bg-red-500/20 text-red-400 p-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">
              Amount ({selectedPair.baseAsset})
            </label>
            <div className="relative">
              <input
                type="text"
                name="amount"
                value={orderForm.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="0.00"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-primary-400 hover:text-primary-300"
                onClick={() => {
                  // Set max amount based on available balance
                  const maxAmount = orderForm.side === 'buy'
                    ? userBalance / (orderForm.type === 'market' ? selectedPair.lastPrice : parseFloat(orderForm.price) || selectedPair.lastPrice)
                    : positions.find(p => p.symbol === selectedPair.baseAsset)?.amount || 0;
                  
                  setOrderForm(prev => {
                    const newForm = { ...prev, amount: maxAmount.toFixed(8) };
                    if (prev.type !== 'market' && prev.price) {
                      newForm.total = (maxAmount * parseFloat(prev.price)).toFixed(2);
                    }
                    return newForm;
                  });
                }}
              >
                MAX
              </button>
            </div>
          </div>
          
          {orderForm.type !== 'market' && (
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">
                Price ({selectedPair.quoteAsset})
              </label>
              <input
                type="text"
                name="price"
                value={orderForm.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="0.00"
              />
            </div>
          )}
          
          {orderForm.type === 'stop' && (
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">
                Stop Price ({selectedPair.quoteAsset})
              </label>
              <input
                type="text"
                name="stopPrice"
                value={orderForm.stopPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="0.00"
              />
            </div>
          )}
          
          {orderForm.type !== 'market' && (
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">
                Total ({selectedPair.quoteAsset})
              </label>
              <input
                type="text"
                name="total"
                value={orderForm.total}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="0.00"
                readOnly
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <div>
              Available Balance:
            </div>
            <div>
              <span className="text-white">
                {orderForm.side === 'buy' 
                  ? `${userBalance.toLocaleString()} ${selectedPair.quoteAsset}`
                  : `${positions.find(p => p.symbol === selectedPair.baseAsset)?.amount || 0} ${selectedPair.baseAsset}`
                }
              </span>
            </div>
          </div>
          
          <Button
            type="submit"
            fullWidth
            variant={orderForm.side === 'buy' ? 'success' : 'danger'}
            isLoading={tradingStatus === 'loading'}
          >
            {orderForm.side === 'buy' ? 'Buy' : 'Sell'} {selectedPair.baseAsset}
          </Button>
        </form>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex border-b border-gray-700 mb-4">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'positions'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('positions')}
          >
            Positions
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'orders'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Open Orders
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'history'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
        
        {activeTab === 'positions' && (
          <div className="space-y-4">
            {positions.length > 0 ? (
              positions.map((position) => (
                <div key={position.symbol} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-white">{position.symbol}</div>
                    <div className={`text-sm ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>Amount: <span className="text-white">{position.amount}</span></div>
                    <div>Value: <span className="text-white">${position.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div>Avg Price: <span className="text-white">${formatPrice(position.avgPrice)}</span></div>
                    <div>Current: <span className="text-white">${formatPrice(position.currentPrice)}</span></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <div className="text-gray-400 mb-2">No positions found</div>
                <div className="text-sm text-gray-500">Your open positions will appear here</div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {openOrders.length > 0 ? (
              openOrders.map((order) => (
                <div key={order.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-white">{order.symbol}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {order.side.toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                    <div>Type: <span className="text-white capitalize">{order.type}</span></div>
                    <div>Amount: <span className="text-white">{order.amount}</span></div>
                    <div>Price: <span className="text-white">${formatPrice(order.price)}</span></div>
                    <div>Total: <span className="text-white">${formatPrice(order.total)}</span></div>
                    {order.stopPrice && (
                      <div>Stop: <span className="text-white">${formatPrice(order.stopPrice)}</span></div>
                    )}
                    <div>Date: <span className="text-white">{formatDateTime(order.date)}</span></div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="xs" 
                    fullWidth
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <div className="text-gray-400 mb-2">No open orders</div>
                <div className="text-sm text-gray-500">Your open orders will appear here</div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="space-y-4">
            {tradeHistory.length > 0 ? (
              tradeHistory.map((trade) => (
                <div key={trade.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-white">{trade.symbol}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${trade.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {trade.side.toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>Amount: <span className="text-white">{trade.amount}</span></div>
                    <div>Price: <span className="text-white">${formatPrice(trade.price)}</span></div>
                    <div>Total: <span className="text-white">${formatPrice(trade.total)}</span></div>
                    <div>Fee: <span className="text-white">${formatPrice(trade.fee)}</span></div>
                    <div colSpan={2}>Date: <span className="text-white">{formatDateTime(trade.date)}</span></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <div className="text-gray-400 mb-2">No trade history</div>
                <div className="text-sm text-gray-500">Your trade history will appear here</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  const renderTradingView = () => (
    <div className="rounded-lg overflow-hidden bg-gray-800">
      <div className="h-[500px]">
        <TradingViewWidget symbol={currentSelectedPair} />
      </div>
    </div>
  );
  
  const renderMarketData = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-800 rounded-lg overflow-hidden h-[400px]">
        <LiveOrderbook symbol={currentSelectedPair} />
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden h-[400px]">
        <MarketDepthChart symbol={currentSelectedPair} />
      </div>
    </div>
  );
  
  const renderRecentTrades = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white">Recent Trades</h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <FaSync size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-800">
            {recentTrades.slice(0, 10).map((trade) => (
              <tr key={trade.id}>
                <td className={`px-4 py-2 text-sm ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPrice(trade.price)}
                </td>
                <td className="px-4 py-2 text-sm text-white text-right">
                  {trade.amount.toFixed(6)}
                </td>
                <td className="px-4 py-2 text-xs text-gray-400 text-right">
                  {new Date(trade.time).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-start lg:items-center mb-2 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Trading Platform</h1>
          
          {isMobile && (
            <Button
              variant="outline"
              onClick={() => setShowSidebar(true)}
              className="self-end"
            >
              <FaBars className="mr-2" /> Trading Menu
            </Button>
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
                onDismiss={() => setShowAlert(false)}
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
                  onClick={() => setShowSidebar(false)}
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
