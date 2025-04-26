import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../common/Button';
import Alert from '../common/Alert';
import {
  placeOrder,
  updateOrderForm,
  resetEntireOrderForm,
  setOrderFormError,
  clearOrderFormError,
  setAlertMessage,
  clearAlert,
  selectSelectedSymbol,
  selectOrderForm,
  selectOrderFormError,
  selectPortfolio,
  selectMarketPrices,
  selectShowAlert,
  selectAlertMessage,
  selectTradingStatus
} from '../../redux/slices/tradingSlice';

const OrderForm = ({ compact = false }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const orderForm = useSelector(selectOrderForm);
  const error = useSelector(selectOrderFormError);
  const portfolio = useSelector(selectPortfolio);
  const marketData = useSelector(selectMarketPrices);
  const showSuccess = useSelector(selectShowAlert);
  const alertMessage = useSelector(selectAlertMessage);
  const tradingStatus = useSelector(selectTradingStatus);
  const isSubmitting = tradingStatus === 'loading';
  
  const { type: orderType, side: orderSide, amount: orderAmount, price: orderPrice, stopPrice, total: orderTotal, expiry } = orderForm;
  
  // Get market data for the selected symbol
  const currentMarket = marketData[selectedSymbol] || {};
  const currentPrice = currentMarket.lastPrice || 0;
  
  // Get user's available balance
  const availableBalance = portfolio.balances?.USDT || 0;
  
  // Parse the symbol into base and quote assets
  const [baseAsset, quoteAsset] = selectedSymbol ? selectedSymbol.split('/') : ['BTC', 'USDT'];
  
  // Get user's available amount for the base asset (for sell orders)
  const baseAssetPosition = portfolio.positions?.find(p => p.symbol === baseAsset);
  const baseAssetAvailable = baseAssetPosition?.amount || 0;

  // Calculate order total when amount or price changes
  useEffect(() => {
    if (orderAmount && (orderType === 'market' || orderPrice)) {
      const price = orderType === 'market' ? currentPrice : parseFloat(orderPrice);
      const amount = parseFloat(orderAmount);
      if (!isNaN(price) && !isNaN(amount)) {
        dispatch(updateOrderForm({ total: (price * amount).toFixed(2) }));
      }
    } else {
      dispatch(updateOrderForm({ total: '0.00' }));
    }
  }, [orderAmount, orderPrice, orderType, currentPrice, dispatch]);

  // Clear error when changing order type or side
  useEffect(() => {
    dispatch(clearOrderFormError());
  }, [orderType, orderSide, dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate input is a valid number
    if (name === 'amount' || name === 'price' || name === 'stopPrice') {
      // Allow empty string or valid numbers
      if (value === '' || (/^\d*\.?\d*$/.test(value) && !isNaN(parseFloat(value)))) {
        dispatch(updateOrderForm({ [name]: value }));
      }
    } else {
      // For non-numeric fields like expiry
      dispatch(updateOrderForm({ [name]: value }));
    }
  };

  // Set order type (market, limit, stop)
  const handleSetOrderType = (type) => {
    dispatch(updateOrderForm({ type }));
  };

  // Set order side (buy, sell)
  const handleSetOrderSide = (side) => {
    dispatch(updateOrderForm({ side }));
  };

  // Handle setting max amount based on available balance
  const handleSetMaxAmount = () => {
    if (orderSide === 'buy') {
      // For buy orders, max is based on available quote currency
      let price = orderType === 'market' ? currentPrice : parseFloat(orderPrice || currentPrice);
      if (isNaN(price) || price <= 0) price = currentPrice;
      
      const maxAmount = (availableBalance / price) * 0.995; // Account for fees
      dispatch(updateOrderForm({ amount: maxAmount.toFixed(8) }));
    } else {
      // For sell orders, max is based on available base currency
      dispatch(updateOrderForm({ amount: baseAssetAvailable.toFixed(8) }));
    }
  };

  // Validate the order form before submission
  const validateForm = () => {
    // Reset previous error
    dispatch(clearOrderFormError());
    
    // Check if we have a symbol selected
    if (!selectedSymbol) {
      dispatch(setOrderFormError('Please select a trading pair'));
      return false;
    }
    
    // Check amount
    if (!orderAmount || isNaN(parseFloat(orderAmount)) || parseFloat(orderAmount) <= 0) {
      dispatch(setOrderFormError('Please enter a valid amount'));
      return false;
    }
    
    // For limit and stop orders, validate price
    if (orderType !== 'market') {
      if (!orderPrice || isNaN(parseFloat(orderPrice)) || parseFloat(orderPrice) <= 0) {
        dispatch(setOrderFormError('Please enter a valid price'));
        return false;
      }
    }
    
    // If it's a stop order, validate stop price
    if (orderType === 'stop' && (!stopPrice || isNaN(parseFloat(stopPrice)) || parseFloat(stopPrice) <= 0)) {
      dispatch(setOrderFormError('Please enter a valid stop price'));
      return false;
    }
    
    // Check if the user has sufficient balance for buy orders
    if (orderSide === 'buy') {
      const totalValue = parseFloat(orderTotal);
      if (totalValue > availableBalance) {
        dispatch(setOrderFormError(`Insufficient ${quoteAsset} balance`));
        return false;
      }
    } else {
      // Check if the user has sufficient assets for sell orders
      const amount = parseFloat(orderAmount);
      if (amount > baseAssetAvailable) {
        dispatch(setOrderFormError(`Insufficient ${baseAsset} balance`));
        return false;
      }
    }
    
    return true;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Prepare order data
      const orderData = {
        symbol: selectedSymbol,
        side: orderSide,
        type: orderType,
        amount: parseFloat(orderAmount),
        price: orderType === 'market' ? currentPrice : parseFloat(orderPrice),
        stopPrice: orderType === 'stop' ? parseFloat(stopPrice) : undefined,
        expiry: expiry,
        total: parseFloat(orderTotal)
      };
      
      const result = await dispatch(placeOrder(orderData)).unwrap();
      
      // Show success message
      dispatch(setAlertMessage({
        type: 'success',
        message: `${orderSide === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`
      }));
      
      // Reset form after successful order
      dispatch(resetEntireOrderForm());
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
    } catch (error) {
      dispatch(setOrderFormError(error.message || 'Failed to place order'));
    }
  };

  // Format price with appropriate decimal precision
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '0.00';
    
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

  return (
    <div className="w-full">
      {/* Order form header */}
      {!compact && (
        <div className="mb-3">
          <h3 className="text-lg font-medium text-white">Place Order</h3>
          <p className="text-gray-400 text-sm">
            {selectedSymbol ? `Trading ${baseAsset}/${quoteAsset}` : 'Select a trading pair to begin'}
          </p>
        </div>
      )}
      
      {/* Success alert */}
      {showSuccess && alertMessage.type === 'success' && (
        <Alert
          type="success"
          message={alertMessage.message}
          className="mb-3"
          onDismiss={() => dispatch(clearAlert())}
        />
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-3 text-sm flex items-start">
          <FaExclamationTriangle className="mr-2 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Order type tabs */}
        <div className={`flex border-b border-gray-700 ${compact ? 'mb-2' : 'mb-4'}`}>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              orderType === 'limit'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleSetOrderType('limit')}
          >
            Limit
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              orderType === 'market'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleSetOrderType('market')}
          >
            Market
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              orderType === 'stop'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleSetOrderType('stop')}
          >
            Stop
          </button>
        </div>
        
        {/* Buy/Sell toggle */}
        <div className={`flex ${compact ? 'mb-2' : 'mb-4'}`}>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-l-lg ${
              orderSide === 'buy'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => handleSetOrderSide('buy')}
          >
            Buy
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-r-lg ${
              orderSide === 'sell'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => handleSetOrderSide('sell')}
          >
            Sell
          </button>
        </div>
        
        {/* Amount input */}
        <div className={compact ? 'mb-2' : 'mb-3'}>
          <label className="block text-xs text-gray-400 mb-1">
            Amount ({baseAsset})
          </label>
          <div className="relative">
            <input
              type="text"
              name="amount"
              value={orderAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="0.00"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-primary-400 hover:text-primary-300"
              onClick={handleSetMaxAmount}
            >
              MAX
            </button>
          </div>
        </div>
        
        {/* Price input - for limit and stop orders */}
        {orderType !== 'market' && (
          <div className={compact ? 'mb-2' : 'mb-3'}>
            <label className="block text-xs text-gray-400 mb-1">
              Price ({quoteAsset})
            </label>
            <div className="relative">
              <input
                type="text"
                name="price"
                value={orderPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="0.00"
              />
              {currentPrice > 0 && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-primary-400 hover:text-primary-300"
                  onClick={() => dispatch(updateOrderForm({ price: currentPrice.toString() }))}
                >
                  CURRENT
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Stop price input - for stop orders */}
        {orderType === 'stop' && (
          <div className={compact ? 'mb-2' : 'mb-3'}>
            <label className="block text-xs text-gray-400 mb-1">
              Stop Price ({quoteAsset})
            </label>
            <input
              type="text"
              name="stopPrice"
              value={stopPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="0.00"
            />
          </div>
        )}
        
        {/* Total - calculated based on amount and price */}
        <div className={compact ? 'mb-2' : 'mb-3'}>
          <label className="block text-xs text-gray-400 mb-1">
            Total ({quoteAsset})
          </label>
          <input
            type="text"
            value={orderTotal}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="0.00"
            disabled
          />
        </div>
        
        {/* Advanced options toggle */}
        {!compact && (
          <div className="mb-3">
            <button
              type="button"
              className="flex items-center text-xs text-primary-400 hover:text-primary-300"
              onClick={() => dispatch(updateOrderForm({ showAdvanced: !orderForm.showAdvanced }))}
            >
              {orderForm.showAdvanced ? '- Hide' : '+ Show'} Advanced Options
            </button>
            
            {orderForm.showAdvanced && (
              <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 mb-1">
                    Time In Force
                  </label>
                  <select
                    name="expiry"
                    value={expiry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  >
                    <option value="GTC">Good Till Cancelled (GTC)</option>
                    <option value="IOC">Immediate or Cancel (IOC)</option>
                    <option value="FOK">Fill or Kill (FOK)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {expiry === 'GTC' && 'Order will remain active until cancelled'}
                    {expiry === 'IOC' && 'Order must be filled immediately, or cancelled'}
                    {expiry === 'FOK' && 'Order must be filled completely immediately, or cancelled'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Available balance indicator */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center">
            <span>Available:</span>
            <FaInfoCircle className="ml-1 text-gray-500" />
          </div>
          <div>
            {orderSide === 'buy' 
              ? <span className="text-white">{availableBalance.toLocaleString()} {quoteAsset}</span>
              : <span className="text-white">{baseAssetAvailable.toLocaleString()} {baseAsset}</span>
            }
          </div>
        </div>
        
        {/* Submit button */}
        <Button
          type="submit"
          fullWidth
          variant={orderSide === 'buy' ? 'success' : 'danger'}
          isLoading={isSubmitting}
        >
          {orderSide === 'buy' ? 'Buy' : 'Sell'} {baseAsset}
        </Button>
      </form>
    </div>
  );
};

OrderForm.propTypes = {
  compact: PropTypes.bool
};

export default OrderForm;
