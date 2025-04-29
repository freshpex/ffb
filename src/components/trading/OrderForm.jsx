import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Alert from '../common/Alert';
import {
  placeOrder,
  updateOrderForm,
  resetEntireOrderForm as resetOrderForm,
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

const OrderForm = ({ compact = false, refreshOrders = null, onOrderSuccess = null }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);

  // Redux state
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const orderForm = useSelector(selectOrderForm);
  const error = useSelector(selectOrderFormError);
  const portfolio = useSelector(selectPortfolio);
  const marketData = useSelector(selectMarketPrices);
  const showSuccess = useSelector(selectShowAlert);
  const alertMessage = useSelector(selectAlertMessage);
  const tradingStatus = useSelector(selectTradingStatus);
  
  // Local calculation state for validation
  const [calculationSource, setCalculationSource] = useState(null);

  const {
    type: orderType,
    side: orderSide,
    amount: orderAmount,
    price: orderPrice,
    stopPrice,
    total: orderTotal,
    expiry
  } = orderForm;

  // Get market data for the selected symbol
  const currentMarket = marketData[selectedSymbol] || {};
  const currentPrice = currentMarket.price || 0;

  // Get user's available balance
  const availableBalance = portfolio.balances?.USDT || 0;

  // Parse the symbol into base and quote assets
  const [baseAsset, quoteAsset] = selectedSymbol ? selectedSymbol.split('/') : ['BTC', 'USDT'];

  // Get user's available amount for the base asset (for sell orders)
  const baseAssetPosition = portfolio.positions?.find(p => p.symbol === baseAsset);
  const baseAssetAvailable = baseAssetPosition?.amount || 0;
  
  // Validation check
  const isValid = () => {
    if (!orderAmount || parseFloat(orderAmount) <= 0) return false;
    if (orderType !== 'market' && (!orderPrice || parseFloat(orderPrice) <= 0)) return false;
    if (orderType === 'stop' && (!stopPrice || parseFloat(stopPrice) <= 0)) return false;
    if (!orderTotal || parseFloat(orderTotal) <= 0) return false;
    
    // Additional validation for buy/sell capacity
    if (orderSide === 'buy' && parseFloat(orderTotal) > availableBalance) return false;
    if (orderSide === 'sell' && parseFloat(orderAmount) > baseAssetAvailable) return false;
    
    return true;
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    if (error) {
      dispatch(clearOrderFormError());
    }

    if (value && isNaN(parseFloat(value))) {
      return;
    }

    setCalculationSource(field);

    dispatch(updateOrderForm({ [field]: value }));
  };

  // When relevant fields are updated, we need to recalculate dependent fields
  useEffect(() => {
    if (!orderAmount && !orderPrice && !orderTotal) return;
    
    if (orderType === 'market' && !orderAmount) return;

    if (calculationSource === null) return;

    try {
      const numAmount = parseFloat(orderAmount) || 0;
      const numPrice = orderType === 'market' ? currentPrice : (parseFloat(orderPrice) || 0);

      // Based on which field was edited, calculate the other
      if (calculationSource === 'amount') {
        // Ensure precision by using parseFloat before toFixed for consistent number handling
        const calculatedTotal = parseFloat((numAmount * numPrice).toFixed(8));
        if (calculatedTotal !== parseFloat(orderTotal)) {
          dispatch(updateOrderForm({ total: calculatedTotal.toFixed(2) }));
        }
      } 
      else if (calculationSource === 'total') {
        const numTotal = parseFloat(orderTotal) || 0;
        if (numPrice > 0) {
          // Ensure precision by using parseFloat before toFixed for consistent number handling
          const calculatedAmount = parseFloat((numTotal / numPrice).toFixed(8));
          if (calculatedAmount !== parseFloat(orderAmount)) {
            dispatch(updateOrderForm({ amount: calculatedAmount.toFixed(8) }));
          }
        }
      } 
      else if (calculationSource === 'price') {
        const calculatedTotal = (numAmount * numPrice).toFixed(2);
        if (calculatedTotal !== orderTotal) {
          dispatch(updateOrderForm({ total: calculatedTotal }));
        }
      }
    } catch (e) {
      console.error("Error in order calculation", e);
    }
  }, [orderAmount, orderPrice, orderTotal, orderType, currentPrice, calculationSource, dispatch]);

  // Handle order type change
  const handleOrderTypeChange = (type) => {
    dispatch(updateOrderForm({ type }));
    
    // Reset price field for market orders
    if (type === 'market') {
      dispatch(updateOrderForm({ price: '' }));
      
      // Recalculate total based on current market price
      if (orderAmount) {
        const numAmount = parseFloat(orderAmount) || 0;
        const calculatedTotal = (numAmount * currentPrice).toFixed(2);
        dispatch(updateOrderForm({ total: calculatedTotal }));
      }
    }
  };

  // Handle order side change (buy/sell)
  const handleOrderSideChange = (side) => {
    dispatch(updateOrderForm({ side }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isValid()) {
      toast.error("Please correct all errors before submitting");
      return;
    }
    
    try {
      // Parse values to ensure they're valid numbers
      const parsedAmount = parseFloat(orderAmount);
      const parsedTotal = parseFloat(orderTotal);
      
      // For market orders, use current market price; otherwise use entered price
      const parsedPrice = orderType === 'market' ? currentPrice : parseFloat(orderPrice);
      
      // Ensure all values are valid numbers
      if (isNaN(parsedAmount) || isNaN(parsedPrice) || isNaN(parsedTotal)) {
        toast.error("Invalid order values. Please check your inputs.");
        return;
      }
      
      setSubmitting(true);
      
      // Prepare the order data with properly formatted numbers
      const orderData = {
        symbol: selectedSymbol,
        side: orderSide,
        type: orderType,
        quantity: parsedAmount.toString(),
        total: parsedTotal.toString(),
        price: parsedPrice.toString()
      };
      
      if (orderType === 'stop') {
        const parsedStopPrice = parseFloat(stopPrice);
        if (isNaN(parsedStopPrice)) {
          toast.error("Invalid stop price. Please check your input.");
          return;
        }
        orderData.stopPrice = parsedStopPrice.toString();
      }
      
      const result = await dispatch(placeOrder(orderData)).unwrap();
      
      if (result.success) {
        toast.success(result.message || "Order placed successfully");
        // Reset the form
        dispatch(resetOrderForm());
        // Refresh open orders
        if (refreshOrders) refreshOrders();
        // Call success callback if provided
        if (onOrderSuccess) onOrderSuccess(result.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order");
      console.error("Order placement error:", error);
    } finally {
      setSubmitting(false);
    }
  };


  // Calculate the maximum amount the user can trade
  const calculateMaxAmount = () => {
    if (orderSide === 'buy') {
      // For buy orders, calculate max amount based on available balance and current price
      if (orderType === 'market') {
        // Use current market price for market orders
        if (currentPrice > 0) {
          const maxAmount = (availableBalance / currentPrice).toFixed(8);
          handleInputChange('amount', maxAmount);
          setCalculationSource('amount');
        }
      } else {
        // Use form price for limit/stop orders
        const numPrice = parseFloat(orderPrice);
        if (numPrice > 0) {
          const maxAmount = (availableBalance / numPrice).toFixed(8);
          handleInputChange('amount', maxAmount);
          setCalculationSource('amount');
        } else {
          dispatch(setOrderFormError('Please enter a valid price first'));
        }
      }
    } else {
      // For sell orders, use available base asset amount
      handleInputChange('amount', baseAssetAvailable.toFixed(8));
      setCalculationSource('amount');
    }
  };

  // Define preset percentage buttons (25%, 50%, 75%, 100%)
  const handlePresetPercentage = (percentage) => {
    if (orderSide === 'buy') {
      // Calculate percentage of available balance
      const maxQuoteAmount = availableBalance * (percentage / 100);
      
      if (orderType === 'market') {
        // Use current market price for market orders
        if (currentPrice > 0) {
          const calculatedAmount = (maxQuoteAmount / currentPrice).toFixed(8);
          handleInputChange('amount', calculatedAmount);
          setCalculationSource('amount');
        }
      } else {
        // Use form price for limit/stop orders
        const numPrice = parseFloat(orderPrice);
        if (numPrice > 0) {
          const calculatedAmount = (maxQuoteAmount / numPrice).toFixed(8);
          handleInputChange('amount', calculatedAmount);
          setCalculationSource('amount');
        } else {
          dispatch(setOrderFormError('Please enter a valid price first'));
        }
      }
    } else {
      // Calculate percentage of available base asset
      const calculatedAmount = (baseAssetAvailable * (percentage / 100)).toFixed(8);
      handleInputChange('amount', calculatedAmount);
      setCalculationSource('amount');
    }
  };

  // Reset on symbol change
  useEffect(() => {
    dispatch(resetOrderForm());
  }, [selectedSymbol, dispatch]);

  // Display success message when order is placed
  useEffect(() => {
    if (showSuccess && alertMessage) {
      setTimeout(() => {
        dispatch(clearAlert());
      }, 5000);
    }
  }, [showSuccess, alertMessage, dispatch]);

  return (
    <div className={`bg-card rounded-lg p-4 ${compact ? 'text-sm' : ''}`}>
      <h2 className="text-lg font-semibold mb-3">Place Order</h2>
      
      {/* Trading Status Alert */}
      {tradingStatus !== 'active' && (
        <Alert 
          type="warning" 
          message={`Trading is currently ${tradingStatus}. Are you sure you want to place orders at this time.`}
          className="mb-3"
        />
      )}
      
      {/* Success Message */}
      {showSuccess && alertMessage && (
        <Alert 
          type="success" 
          message={alertMessage}
          className="mb-3"
        />
      )}
      
      {/* Error Message */}
      {error && (
        <Alert 
          type="error" 
          message={error}
          className="mb-3"
        />
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Order Type Selector */}
        <div className="mb-4">
          <div className="flex space-x-2 mb-2">
            <button
              type="button"
              className={`flex-1 py-2 rounded-md ${orderType === 'market' ? 'bg-primary text-white' : 'bg-card-light'}`}
              onClick={() => handleOrderTypeChange('market')}
            >
              Market
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-md ${orderType === 'limit' ? 'bg-primary text-white' : 'bg-card-light'}`}
              onClick={() => handleOrderTypeChange('limit')}
            >
              Limit
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-md ${orderType === 'stop' ? 'bg-primary text-white' : 'bg-card-light'}`}
              onClick={() => handleOrderTypeChange('stop')}
            >
              Stop
            </button>
          </div>
        </div>
        
        {/* Buy/Sell Selector */}
        <div className="mb-4">
          <div className="flex space-x-2">
            <button
              type="button"
              className={`flex-1 py-3 rounded-md font-medium ${orderSide === 'buy' ? 'bg-green-600 text-white' : 'bg-card-light'}`}
              onClick={() => handleOrderSideChange('buy')}
            >
              Buy
            </button>
            <button
              type="button"
              className={`flex-1 py-3 rounded-md font-medium ${orderSide === 'sell' ? 'bg-red-600 text-white' : 'bg-card-light'}`}
              onClick={() => handleOrderSideChange('sell')}
            >
              Sell
            </button>
          </div>
        </div>
        
        {/* Available Balance Info */}
        <div className="mb-4 text-xs">
          {orderSide === 'buy' ? (
            <div className="flex justify-between">
              <span>Available:</span>
              <span className="font-medium">{availableBalance.toFixed(2)} USDT</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span>Available:</span>
              <span className="font-medium">{baseAssetAvailable.toFixed(8)} {baseAsset}</span>
            </div>
          )}
        </div>
        
        {/* Amount Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Amount ({baseAsset})
          </label>
          <div className="relative">
            <input
              type="text"
              value={orderAmount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="w-full p-3 rounded-md bg-card-dark border border-border"
              placeholder={`Enter ${baseAsset} amount`}
            />
            {orderSide === 'sell' && parseFloat(orderAmount) > baseAssetAvailable && (
              <div className="absolute right-3 top-3 text-red-500">
                <FaExclamationTriangle />
              </div>
            )}
          </div>
        </div>
        
        {/* Price Field (for limit and stop orders) */}
        {orderType !== 'market' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Price ({quoteAsset})
            </label>
            <div className="relative">
              <input
                type="text"
                value={orderPrice}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full p-3 rounded-md bg-card-dark border border-border"
                placeholder={`Enter price in ${quoteAsset}`}
              />
              <div className="absolute right-3 top-3 text-dim">
                <span className="text-xs">{currentPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Stop Price (for stop orders) */}
        {orderType === 'stop' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Stop Price ({quoteAsset})
            </label>
            <input
              type="text"
              value={stopPrice}
              onChange={(e) => handleInputChange('stopPrice', e.target.value)}
              className="w-full p-3 rounded-md bg-card-dark border border-border"
              placeholder={`Enter stop price in ${quoteAsset}`}
            />
          </div>
        )}
        
        {/* Total Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Total ({quoteAsset})
          </label>
          <div className="relative">
            <input
              type="text"
              value={orderTotal}
              onChange={(e) => handleInputChange('total', e.target.value)}
              className="w-full p-3 rounded-md bg-card-dark border border-border"
              placeholder={`Enter total in ${quoteAsset}`}
            />
            {orderSide === 'buy' && parseFloat(orderTotal) > availableBalance && (
              <div className="absolute right-3 top-3 text-red-500">
                <FaExclamationTriangle />
              </div>
            )}
          </div>
        </div>
        
        {/* Order Button */}
        <Button
          type="submit"
          variant={orderSide === 'buy' ? 'success' : 'danger'}
          className="w-full py-3 uppercase font-bold"
          disabled={!isValid() || isSubmitting}
          loading={isSubmitting}
        >
          {orderSide === 'buy' ? `Buy ${baseAsset}` : `Sell ${baseAsset}`}
        </Button>
        
        {/* Order Info */}
        <div className="mt-3 text-xs text-dim">
          <div className="flex items-center mb-1">
            <FaInfoCircle className="mr-1" />
            <span>
              {orderType === 'market' 
                ? 'Market orders execute immediately at the best available price' 
                : orderType === 'limit'
                  ? 'Limit orders execute when the price reaches your specified value'
                  : 'Stop orders convert to market orders when triggered'}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

OrderForm.propTypes = {
  compact: PropTypes.bool,
  refreshOrders: PropTypes.func,
  onOrderSuccess: PropTypes.func
};

export default OrderForm;
