import { createSlice } from '@reduxjs/toolkit';

// Mock data for trading orders
const mockOrders = [
  {
    id: 'ord-10045',
    symbol: 'BTC/USDT',
    type: 'market',
    side: 'buy',
    amount: 0.5,
    price: 64352.12,
    total: 32176.06,
    status: 'filled',
    date: '2023-11-28T14:30:00Z'
  },
  {
    id: 'ord-10046',
    symbol: 'ETH/USDT',
    type: 'limit',
    side: 'sell',
    amount: 2.5,
    price: 3450.78,
    total: 8626.95,
    status: 'open',
    date: '2023-11-28T15:45:00Z'
  },
  {
    id: 'ord-10047',
    symbol: 'BNB/USDT',
    type: 'stop',
    side: 'buy',
    amount: 10,
    price: 245.30,
    stopPrice: 250.00,
    total: 2453.00,
    status: 'open',
    date: '2023-11-28T16:20:00Z'
  }
];

// Mock data for portfolio
const mockPositions = [
  {
    symbol: 'BTC',
    amount: 1.25,
    avgPrice: 61243.50,
    currentPrice: 64352.12,
    value: 80440.15,
    pnl: 3885.78,
    pnlPercentage: 5.08
  },
  {
    symbol: 'ETH',
    amount: 15,
    avgPrice: 3200.40,
    currentPrice: 3450.78,
    value: 51761.70,
    pnl: 3755.70,
    pnlPercentage: 7.82
  },
  {
    symbol: 'BNB',
    amount: 50,
    avgPrice: 230.45,
    currentPrice: 245.30,
    value: 12265.00,
    pnl: 742.50,
    pnlPercentage: 6.44
  },
  {
    symbol: 'SOL',
    amount: 200,
    avgPrice: 95.20,
    currentPrice: 105.75,
    value: 21150.00,
    pnl: 2110.00,
    pnlPercentage: 11.08
  }
];

// Mock trade history
const mockTradeHistory = [
  {
    id: 'trade-10001',
    symbol: 'BTC/USDT',
    side: 'buy',
    amount: 0.5,
    price: 61243.50,
    total: 30621.75,
    fee: 30.62,
    date: '2023-11-20T10:30:00Z'
  },
  {
    id: 'trade-10002',
    symbol: 'ETH/USDT',
    side: 'buy',
    amount: 5,
    price: 3200.40,
    total: 16002.00,
    fee: 16.00,
    date: '2023-11-21T11:45:00Z'
  },
  {
    id: 'trade-10003',
    symbol: 'ETH/USDT',
    side: 'buy',
    amount: 10,
    price: 3200.40,
    total: 32004.00,
    fee: 32.00,
    date: '2023-11-22T14:15:00Z'
  },
  {
    id: 'trade-10004',
    symbol: 'BNB/USDT',
    side: 'buy',
    amount: 50,
    price: 230.45,
    total: 11522.50,
    fee: 11.52,
    date: '2023-11-23T09:30:00Z'
  },
  {
    id: 'trade-10005',
    symbol: 'SOL/USDT',
    side: 'buy',
    amount: 200,
    price: 95.20,
    total: 19040.00,
    fee: 19.04,
    date: '2023-11-24T16:45:00Z'
  }
];

// Mock available trading pairs
const mockTradingPairs = [
  { 
    symbol: 'BTC/USDT', 
    baseAsset: 'BTC', 
    quoteAsset: 'USDT',
    lastPrice: 64352.12,
    priceChange: 2.45,
    volume: 1452367890.45
  },
  { 
    symbol: 'ETH/USDT', 
    baseAsset: 'ETH', 
    quoteAsset: 'USDT',
    lastPrice: 3450.78,
    priceChange: -1.23,
    volume: 883254167.78
  },
  { 
    symbol: 'BNB/USDT', 
    baseAsset: 'BNB', 
    quoteAsset: 'USDT',
    lastPrice: 245.30,
    priceChange: 0.95,
    volume: 452361789.23
  },
  { 
    symbol: 'SOL/USDT', 
    baseAsset: 'SOL', 
    quoteAsset: 'USDT',
    lastPrice: 105.75,
    priceChange: 3.87,
    volume: 356124897.32
  },
  { 
    symbol: 'ADA/USDT', 
    baseAsset: 'ADA', 
    quoteAsset: 'USDT',
    lastPrice: 0.42,
    priceChange: -0.54,
    volume: 154231568.90
  }
];

const initialState = {
  orders: mockOrders,
  positions: mockPositions,
  tradeHistory: mockTradeHistory,
  tradingPairs: mockTradingPairs,
  selectedPair: mockTradingPairs[0],
  orderBook: {
    bids: [], // Will be populated with mock data when a pair is selected
    asks: []
  },
  recentTrades: [],
  status: 'idle',
  error: null
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    setSelectedPair(state, action) {
      const pair = state.tradingPairs.find(p => p.symbol === action.payload);
      if (pair) {
        state.selectedPair = pair;
        // Generate mock orderbook data for the selected pair
        state.orderBook = generateMockOrderBook(pair);
        state.recentTrades = generateMockRecentTrades(pair);
      }
    },
    
    placeOrderStart(state) {
      state.status = 'loading';
    },
    
    placeOrderSuccess(state, action) {
      state.status = 'succeeded';
      // Add new order to orders list
      state.orders.unshift(action.payload);
      
      // If it's a market order, also add it to trade history
      if (action.payload.type === 'market') {
        const trade = {
          id: `trade-${Date.now()}`,
          symbol: action.payload.symbol,
          side: action.payload.side,
          amount: action.payload.amount,
          price: action.payload.price,
          total: action.payload.total,
          fee: action.payload.total * 0.001, // 0.1% fee
          date: new Date().toISOString()
        };
        state.tradeHistory.unshift(trade);
        
        // Update positions based on the trade
        updatePositions(state, trade);
      }
    },
    
    placeOrderFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    cancelOrderStart(state) {
      state.status = 'loading';
    },
    
    cancelOrderSuccess(state, action) {
      state.status = 'succeeded';
      // Find order and update its status
      const order = state.orders.find(o => o.id === action.payload);
      if (order) {
        order.status = 'canceled';
      }
    },
    
    cancelOrderFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    fillOrder(state, action) {
      // This would be triggered by a websocket update in a real app
      const { orderId, price } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      
      if (order && order.status === 'open') {
        order.status = 'filled';
        order.executedPrice = price;
        
        // Create a corresponding trade
        const trade = {
          id: `trade-${Date.now()}`,
          symbol: order.symbol,
          side: order.side,
          amount: order.amount,
          price: price,
          total: order.amount * price,
          fee: order.amount * price * 0.001, // 0.1% fee
          date: new Date().toISOString()
        };
        
        state.tradeHistory.unshift(trade);
        
        // Update positions
        updatePositions(state, trade);
      }
    },
    
    updateMarketPrices(state, action) {
      // This would be triggered by a websocket update in a real app
      const { symbol, price, priceChange } = action.payload;
      
      // Update trading pair price
      const pair = state.tradingPairs.find(p => p.symbol === symbol);
      if (pair) {
        pair.lastPrice = price;
        pair.priceChange = priceChange;
      }
      
      // Update positions based on new prices
      const baseAsset = symbol.split('/')[0];
      const position = state.positions.find(p => p.symbol === baseAsset);
      if (position) {
        position.currentPrice = price;
        position.value = position.amount * price;
        position.pnl = position.value - (position.amount * position.avgPrice);
        position.pnlPercentage = (position.pnl / (position.amount * position.avgPrice)) * 100;
      }
    },
    
    resetTradingState: () => initialState
  }
});

// Helper function to update positions after a trade
const updatePositions = (state, trade) => {
  const baseAsset = trade.symbol.split('/')[0];
  const position = state.positions.find(p => p.symbol === baseAsset);
  
  if (trade.side === 'buy') {
    if (position) {
      // Update existing position
      const newTotalAmount = position.amount + trade.amount;
      const newTotalValue = (position.amount * position.avgPrice) + trade.total;
      position.amount = newTotalAmount;
      position.avgPrice = newTotalValue / newTotalAmount;
      position.value = newTotalAmount * position.currentPrice;
      position.pnl = position.value - newTotalValue;
      position.pnlPercentage = (position.pnl / newTotalValue) * 100;
    } else {
      // Create new position
      state.positions.push({
        symbol: baseAsset,
        amount: trade.amount,
        avgPrice: trade.price,
        currentPrice: trade.price,
        value: trade.total,
        pnl: 0,
        pnlPercentage: 0
      });
    }
  } else if (trade.side === 'sell' && position) {
    // Decrease position
    position.amount -= trade.amount;
    
    // If amount becomes 0 or negative, remove the position
    if (position.amount <= 0) {
      state.positions = state.positions.filter(p => p.symbol !== baseAsset);
    } else {
      // Recalculate position values
      position.value = position.amount * position.currentPrice;
      position.pnl = position.value - (position.amount * position.avgPrice);
      position.pnlPercentage = (position.pnl / (position.amount * position.avgPrice)) * 100;
    }
  }
};

// Helper function to generate mock order book
const generateMockOrderBook = (pair) => {
  const basePrice = pair.lastPrice;
  const bids = [];
  const asks = [];
  
  // Generate 20 bid orders (buy orders below current price)
  for (let i = 1; i <= 20; i++) {
    const price = basePrice * (1 - (i * 0.001));
    const amount = Math.random() * 10 + 0.1;
    bids.push({ price, amount, total: price * amount });
  }
  
  // Generate 20 ask orders (sell orders above current price)
  for (let i = 1; i <= 20; i++) {
    const price = basePrice * (1 + (i * 0.001));
    const amount = Math.random() * 10 + 0.1;
    asks.push({ price, amount, total: price * amount });
  }
  
  // Sort bids descending (highest price first)
  bids.sort((a, b) => b.price - a.price);
  
  // Sort asks ascending (lowest price first)
  asks.sort((a, b) => a.price - b.price);
  
  return { bids, asks };
};

// Helper function to generate mock recent trades
const generateMockRecentTrades = (pair) => {
  const trades = [];
  const basePrice = pair.lastPrice;
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const price = basePrice * (1 + (Math.random() * 0.01 - 0.005));
    const amount = Math.random() * 2 + 0.01;
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const tradeTime = new Date(now.getTime() - (i * 30000)); // 30 seconds between trades
    
    trades.push({
      id: `rt-${Date.now()}-${i}`,
      price,
      amount,
      total: price * amount,
      side,
      time: tradeTime.toISOString()
    });
  }
  
  return trades;
};

export const {
  setSelectedPair,
  placeOrderStart,
  placeOrderSuccess,
  placeOrderFailure,
  cancelOrderStart,
  cancelOrderSuccess,
  cancelOrderFailure,
  fillOrder,
  updateMarketPrices,
  resetTradingState
} = tradingSlice.actions;

// Thunk for placing an order
export const placeOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(placeOrderStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newOrder = {
      id: `ord-${Date.now()}`,
      date: new Date().toISOString(),
      status: orderData.type === 'market' ? 'filled' : 'open',
      ...orderData
    };
    
    dispatch(placeOrderSuccess(newOrder));
    return { success: true, data: newOrder };
  } catch (error) {
    dispatch(placeOrderFailure(error.message || 'Failed to place order'));
    return { success: false, error: error.message };
  }
};

// Thunk for canceling an order
export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(cancelOrderStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(cancelOrderSuccess(orderId));
    return { success: true };
  } catch (error) {
    dispatch(cancelOrderFailure(error.message || 'Failed to cancel order'));
    return { success: false, error: error.message };
  }
};

// Selectors
export const selectOrders = state => state.trading?.orders || [];
export const selectOpenOrders = state => state.trading?.orders.filter(o => o.status === 'open') || [];
export const selectPositions = state => state.trading?.positions || [];
export const selectTradeHistory = state => state.trading?.tradeHistory || [];
export const selectTradingPairs = state => state.trading?.tradingPairs || [];
export const selectSelectedPair = state => state.trading?.selectedPair;
export const selectOrderBook = state => state.trading?.orderBook || { bids: [], asks: [] };
export const selectRecentTrades = state => state.trading?.recentTrades || [];
export const selectTradingStatus = state => state.trading?.status || 'idle';
export const selectTradingError = state => state.trading?.error;

export default tradingSlice.reducer;
