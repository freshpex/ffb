import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  FaInfoCircle, 
  FaQuestionCircle, 
  FaExclamationTriangle,
  FaExchangeAlt,
  FaDollarSign,
  FaPercent,
  FaArrowDown,
  FaArrowUp
} from 'react-icons/fa';
import { 
  updateTradingForm,
  submitOrder,
  selectTradingForm,
  selectMarketPrices,
  selectSelectedAsset,
  selectAccountBalance,
  selectPositions
} from '../../../redux/slices/tradingSlice';
import Button from '../../common/Button';

const OrderForm = ({ className }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const tradingForm = useSelector(selectTradingForm);
  const marketPrices = useSelector(selectMarketPrices);
  const selectedAsset = useSelector(selectSelectedAsset);
  const accountBalance = useSelector(selectAccountBalance);
  const positions = useSelector(selectPositions);
  
  // Local state
  const [leverageOpen, setLeverageOpen] = useState(false);
  const [error, setError] = useState('');
  const [localForm, setLocalForm] = useState({
    orderType: tradingForm.orderType,
    side: tradingForm.side,
    amount: tradingForm.amount,
    price: tradingForm.price,
    stopPrice: tradingForm.stopPrice,
    leverageMode: 'fixed', // 'fixed' or 'percentage'
    leverageValue: 1,
    leveragePercentage: 1,
    total: 0
  });
  
  // Get current market price for the selected asset
  const currentPrice = marketPrices[selectedAsset]?.current || 0;
  
  // Parse the selected asset to get base and quote assets
  const [baseAsset, quoteAsset] = selectedAsset.split('/');
  
  // Find user's balance for the base asset (for sell orders)
  const baseAssetBalance = positions.find(pos => pos.symbol === baseAsset)?.amount || 0;
  
  // Update local form when trading form changes
  useEffect(() => {
    setLocalForm(prev => ({
      ...prev,
      orderType: tradingForm.orderType,
      side: tradingForm.side,
      amount: tradingForm.amount,
      price: tradingForm.price || (prev.orderType !== 'market' ? currentPrice.toFixed(2) : ''),
      stopPrice: tradingForm.stopPrice,
    }));
  }, [tradingForm, currentPrice]);
  
  // Calculate the total cost when amount or price changes
  useEffect(() => {
    if (localForm.amount) {
      const amount = parseFloat(localForm.amount);
      const price = localForm.orderType === 'market' 
        ? currentPrice 
        : parseFloat(localForm.price) || currentPrice;
      
      if (!isNaN(amount) && !isNaN(price)) {
        const total = amount * price;
        setLocalForm(prev => ({ ...prev, total }));
      }
    }
  }, [localForm.amount, localForm.price, localForm.orderType, currentPrice]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleLeverageChange = (e) => {
    const { name, value } = e.target;
    if (name === 'leverageMode') {
      setLocalForm(prev => ({ ...prev, leverageMode: value }));
    } else if (name === 'leverageValue') {
      const leverageValue = Math.min(Math.max(parseInt(value) || 1, 1), 100);
      setLocalForm(prev => ({ ...prev, leverageValue }));
    }
  };
  
  const handleSideChange = (side) => {
    setLocalForm(prev => ({ ...prev, side }));
    dispatch(updateTradingForm({ side }));
    setError('');
  };
  
  const handleOrderTypeChange = (orderType) => {
    // Reset price fields when changing order type
    const updates = { orderType };
    
    if (orderType === 'market') {
      updates.price = '';
      updates.stopPrice = '';
    } else if (orderType === 'stop') {
      updates.stopPrice = currentPrice.toFixed(2);
      updates.price = currentPrice.toFixed(2);
    }
    
    setLocalForm(prev => ({ ...prev, ...updates }));
    dispatch(updateTradingForm(updates));
    setError('');
  };
  
  const validateForm = () => {
    if (!localForm.amount || isNaN(parseFloat(localForm.amount)) || parseFloat(localForm.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (localForm.orderType !== 'market') {
      if (!localForm.price || isNaN(parseFloat(localForm.price)) || parseFloat(localForm.price) <= 0) {
        setError('Please enter a valid price');
        return false;
      }
    }
    
    if (['stop', 'stop_limit'].includes(localForm.orderType)) {
      if (!localForm.stopPrice || isNaN(parseFloat(localForm.stopPrice)) || parseFloat(localForm.stopPrice) <= 0) {
        setError('Please enter a valid stop price');
        return false;
      }
      
      // Validate stop price direction based on side
      if (localForm.side === 'buy' && parseFloat(localForm.stopPrice) < currentPrice) {
        setError('Buy stop price must be above current price');
        return false;
      }
      
      if (localForm.side === 'sell' && parseFloat(localForm.stopPrice) > currentPrice) {
        setError('Sell stop price must be below current price');
        return false;
      }
    }
    
    // Check if user has enough balance
    if (localForm.side === 'buy') {
      const total = localForm.total;
      if (total > accountBalance) {
        setError(`Insufficient ${quoteAsset} balance`);
        return false;
      }
    } else {
      // Check if user has enough of the base asset
      const amount = parseFloat(localForm.amount);
      if (amount > baseAssetBalance) {
        setError(`Insufficient ${baseAsset} balance`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const orderData = {
        orderType: localForm.orderType,
        side: localForm.side,
        amount: parseFloat(localForm.amount),
        price: localForm.orderType === 'market' ? currentPrice : parseFloat(localForm.price),
        stopPrice: ['stop', 'stop_limit'].includes(localForm.orderType) ? parseFloat(localForm.stopPrice) : undefined,
        leverage: localForm.leverageValue,
        symbol: selectedAsset
      };
      
      await dispatch(submitOrder(orderData));
      
      // Reset form
      setLocalForm(prev => ({
        ...prev,
        amount: '',
        total: 0
      }));
      
      dispatch(updateTradingForm({
        amount: '',
        total: 0
      }));
      
    } catch (error) {
      setError(error.message || 'Failed to place order');
    }
  };
  
  const setPercentageAmount = (percentage) => {
    if (localForm.side === 'buy') {
      // Calculate amount based on account balance and current price
      const availableBalance = accountBalance;
      const price = localForm.orderType === 'market' ? currentPrice : parseFloat(localForm.price) || currentPrice;
      
      if (availableBalance > 0 && price > 0) {
        const amount = ((availableBalance * percentage) / 100) / price;
        const formattedAmount = amount.toFixed(8);
        
        setLocalForm(prev => ({
          ...prev,
          amount: formattedAmount
        }));
        
        dispatch(updateTradingForm({
          amount: formattedAmount
        }));
      }
    } else {
      // Calculate amount based on base asset balance
      const amount = (baseAssetBalance * percentage) / 100;
      const formattedAmount = amount.toFixed(8);
      
      setLocalForm(prev => ({
        ...prev,
        amount: formattedAmount
      }));
      
      dispatch(updateTradingForm({
        amount: formattedAmount
      }));
    }
  };
  
  return (
    <div className={`bg-gray-800 p-4 rounded-lg border border-gray-700 ${className}`}>
      <h3 className="text-white font-medium mb-4">Place Order</h3>
      
      {/* Order Type and Side tabs */}
      <div className="mb-4 flex flex-col space-y-3">
        {/* Order type selector */}
        <div className="bg-gray-900 p-1 rounded-lg flex">
          <button 
            onClick={() => handleOrderTypeChange('market')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              localForm.orderType === 'market' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Market
          </button>
          <button 
            onClick={() => handleOrderTypeChange('limit')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              localForm.orderType === 'limit' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Limit
          </button>
          <button 
            onClick={() => handleOrderTypeChange('stop')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              localForm.orderType === 'stop' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Stop
          </button>
        </div>
        
        {/* Buy/Sell selector */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleSideChange('buy')}
            className={`py-2 rounded-md text-sm font-medium ${
              localForm.side === 'buy' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <FaArrowDown className="inline mr-1" /> Buy
          </button>
          <button 
            onClick={() => handleSideChange('sell')}
            className={`py-2 rounded-md text-sm font-medium ${
              localForm.side === 'sell' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <FaArrowUp className="inline mr-1" /> Sell
          </button>
        </div>
      </div>
      
      {/* Order form */}
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-600 rounded-md text-red-500 text-sm flex items-center">
            <FaExclamationTriangle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Current price info */}
        <div className="mb-4 flex items-center justify-between p-3 bg-gray-700/30 rounded-md">
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-white font-medium">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</div>
        </div>
        
        {/* Amount input */}
        <div className="mb-4">
          <label className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Amount ({baseAsset})</span>
            <span className="text-gray-500">
              Available: {localForm.side === 'sell' ? baseAssetBalance.toFixed(8) : (accountBalance / currentPrice).toFixed(8)}
            </span>
          </label>
          <div className="flex">
            <input
              type="text"
              name="amount"
              value={localForm.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            />
          </div>
          
          {/* Percentage buttons */}
          <div className="flex justify-between mt-2">
            {[25, 50, 75, 100].map((percent) => (
              <button
                key={percent}
                type="button"
                onClick={() => setPercentageAmount(percent)}
                className="text-xs py-1 px-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-md"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>
        
        {/* Price input for limit orders */}
        {localForm.orderType !== 'market' && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Price ({quoteAsset})</label>
            <div className="flex">
              <input
                type="text"
                name="price"
                value={localForm.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              />
            </div>
          </div>
        )}
        
        {/* Stop price input for stop orders */}
        {['stop', 'stop_limit'].includes(localForm.orderType) && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">
              Stop Price ({quoteAsset})
              <span className="text-gray-500 ml-1 text-xs">
                (Trigger price)
              </span>
            </label>
            <div className="flex">
              <input
                type="text"
                name="stopPrice"
                value={localForm.stopPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              />
            </div>
          </div>
        )}
        
        {/* Leverage option (collapsed by default) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setLeverageOpen(!leverageOpen)}
            className="flex items-center w-full p-2 text-sm text-gray-400 hover:text-white bg-gray-700/30 rounded-md"
          >
            <FaExchangeAlt className="mr-2" />
            <span>Leverage: {localForm.leverageValue}x</span>
            <span className="ml-auto">{leverageOpen ? '▲' : '▼'}</span>
          </button>
          
          {leverageOpen && (
            <div className="mt-2 p-3 bg-gray-700/30 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Leverage Mode</label>
                <div className="flex bg-gray-800 rounded-md p-1">
                  <button
                    type="button"
                    className={`text-xs px-2 py-1 rounded-md ${
                      localForm.leverageMode === 'fixed' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleLeverageChange({ target: { name: 'leverageMode', value: 'fixed' } })}
                  >
                    <FaDollarSign className="inline mr-1" size={10} /> Fixed
                  </button>
                  <button
                    type="button"
                    className={`text-xs px-2 py-1 rounded-md ${
                      localForm.leverageMode === 'percentage' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleLeverageChange({ target: { name: 'leverageMode', value: 'percentage' } })}
                  >
                    <FaPercent className="inline mr-1" size={10} /> Percentage
                  </button>
                </div>
              </div>
              
              <div className="mb-2">
                <label className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Leverage Value</span>
                  <span className="text-gray-500">{localForm.leverageValue}x</span>
                </label>
                <input
                  type="range"
                  name="leverageValue"
                  min="1"
                  max="100"
                  value={localForm.leverageValue}
                  onChange={handleLeverageChange}
                  className="w-full appearance-none h-2 bg-gray-600 rounded-full outline-none"
                />
              </div>
              
              <div className="text-xs text-gray-500 flex items-start">
                <FaInfoCircle className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Higher leverage increases both potential profit and risk. Using 10x leverage means your position can be liquidated with a 10% move against you.
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Total calculation */}
        <div className="mb-6 p-3 bg-gray-700/30 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">
              Total {localForm.side === 'buy' ? 'Cost' : 'Receive'} ({quoteAsset})
            </span>
            <span className="text-white font-medium">
              {localForm.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
            </span>
          </div>
          
          {localForm.orderType !== 'market' && (
            <div className="text-xs text-gray-500 flex items-start">
              <FaInfoCircle className="text-primary-500 mr-1 mt-0.5 flex-shrink-0" />
              <span>
                {localForm.orderType === 'limit' 
                  ? 'Your order will be executed when the price reaches your limit price or better.'
                  : 'Your order will be executed when the price reaches your stop price.'}
              </span>
            </div>
          )}
        </div>
        
        {/* Submit button */}
        <Button
          type="submit"
          variant={localForm.side === 'buy' ? 'success' : 'danger'}
          isLoading={tradingForm.processing}
          disabled={tradingForm.processing}
          fullWidth
        >
          {localForm.side === 'buy' ? 'Buy' : 'Sell'} {baseAsset}
        </Button>
      </form>
    </div>
  );
};

OrderForm.propTypes = {
  className: PropTypes.string
};

OrderForm.defaultProps = {
  className: ''
};

export default OrderForm;
