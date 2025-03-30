// Mock Trading Data for Development

// Mock Trading Pairs
export const mockAssets = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC/USD',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    pricePrecision: 2,
    quantityPrecision: 6,
    minOrderSize: 0.0001,
    maxOrderSize: 100,
    category: 'crypto'
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH/USD',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    pricePrecision: 2,
    quantityPrecision: 5,
    minOrderSize: 0.001,
    maxOrderSize: 1000,
    category: 'crypto'
  },
  {
    id: 'LTC',
    name: 'Litecoin',
    symbol: 'LTC/USD',
    baseAsset: 'LTC',
    quoteAsset: 'USD',
    pricePrecision: 2,
    quantityPrecision: 4,
    minOrderSize: 0.01,
    maxOrderSize: 10000,
    category: 'crypto'
  },
  {
    id: 'XRP',
    name: 'Ripple',
    symbol: 'XRP/USD',
    baseAsset: 'XRP',
    quoteAsset: 'USD',
    pricePrecision: 4,
    quantityPrecision: 2,
    minOrderSize: 1,
    maxOrderSize: 1000000,
    category: 'crypto'
  },
  {
    id: 'ADA',
    name: 'Cardano',
    symbol: 'ADA/USD',
    baseAsset: 'ADA',
    quoteAsset: 'USD',
    pricePrecision: 4,
    quantityPrecision: 2,
    minOrderSize: 1,
    maxOrderSize: 1000000,
    category: 'crypto'
  },
  // Forex pairs
  {
    id: 'EURUSD',
    name: 'Euro / US Dollar',
    symbol: 'EUR/USD',
    baseAsset: 'EUR',
    quoteAsset: 'USD',
    pricePrecision: 5,
    quantityPrecision: 2,
    minOrderSize: 0.01,
    maxOrderSize: 10000000,
    category: 'forex'
  },
  {
    id: 'GBPUSD',
    name: 'British Pound / US Dollar',
    symbol: 'GBP/USD',
    baseAsset: 'GBP',
    quoteAsset: 'USD',
    pricePrecision: 5,
    quantityPrecision: 2,
    minOrderSize: 0.01,
    maxOrderSize: 10000000,
    category: 'forex'
  },
  // Stock indices 
  {
    id: 'US500',
    name: 'S&P 500 Index',
    symbol: 'US500/USD',
    baseAsset: 'US500',
    quoteAsset: 'USD',
    pricePrecision: 2,
    quantityPrecision: 2,
    minOrderSize: 0.01,
    maxOrderSize: 1000,
    category: 'indices'
  },
  {
    id: 'US30',
    name: 'Dow Jones Industrial Average',
    symbol: 'US30/USD',
    baseAsset: 'US30',
    quoteAsset: 'USD',
    pricePrecision: 2,
    quantityPrecision: 2,
    minOrderSize: 0.01,
    maxOrderSize: 1000,
    category: 'indices'
  },
  // Commodities
  {
    id: 'XAUUSD',
    name: 'Gold / US Dollar',
    symbol: 'XAU/USD',
    baseAsset: 'XAU',
    quoteAsset: 'USD',
    pricePrecision: 2,
    quantityPrecision: 3,
    minOrderSize: 0.001,
    maxOrderSize: 1000,
    category: 'commodities'
  },
  {
    id: 'XAGUSD',
    name: 'Silver / US Dollar',
    symbol: 'XAG/USD',
    baseAsset: 'XAG',
    quoteAsset: 'USD',
    pricePrecision: 3,
    quantityPrecision: 2,
    minOrderSize: 0.01,
    maxOrderSize: 10000,
    category: 'commodities'
  }
];

// Order types for trading form
export const mockOrderTypes = [
  { 
    id: 'market', 
    name: 'Market Order',
    description: 'Execute immediately at the current market price'
  },
  { 
    id: 'limit', 
    name: 'Limit Order',
    description: 'Execute at specified price or better'
  },
  { 
    id: 'stop', 
    name: 'Stop Order',
    description: 'Becomes a market order when a specified price is reached'
  },
  { 
    id: 'stop_limit', 
    name: 'Stop Limit Order',
    description: 'Becomes a limit order when a specified price is reached'
  },
  { 
    id: 'trailing_stop', 
    name: 'Trailing Stop Order',
    description: 'Stop price follows the market by a specified offset'
  }
];

// Mock market data generator
export const mockMarketData = async (symbol = 'BTC/USD') => {
  // Find the asset by symbol
  const asset = mockAssets.find(a => a.symbol === symbol) || mockAssets[0];
  
  // Generate a base price based on the asset
  let basePrice;
  switch (asset.id) {
    case 'BTC': basePrice = 65000; break;
    case 'ETH': basePrice = 3450; break;
    case 'LTC': basePrice = 85; break;
    case 'XRP': basePrice = 0.67; break;
    case 'ADA': basePrice = 0.48; break;
    case 'EURUSD': basePrice = 1.08; break;
    case 'GBPUSD': basePrice = 1.25; break;
    case 'US500': basePrice = 4580; break;
    case 'US30': basePrice = 36000; break;
    case 'XAUUSD': basePrice = 1950; break;
    case 'XAGUSD': basePrice = 23.5; break;
    default: basePrice = 100;
  }
  
  // Add some randomness to the price
  const currentPrice = basePrice * (1 + (Math.random() * 0.02 - 0.01)); // +/- 1%
  const previousPrice = basePrice * (1 + (Math.random() * 0.02 - 0.01)); // +/- 1%
  const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
  
  // Generate order book data
  const orderBook = generateOrderBook(currentPrice, asset.pricePrecision, asset.quantityPrecision);
  
  // Generate recent trades
  const recentTrades = generateRecentTrades(symbol, currentPrice, asset.pricePrecision, asset.quantityPrecision);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    prices: {
      [symbol]: {
        current: currentPrice,
        previous: previousPrice,
        change: changePercent,
        high24h: currentPrice * 1.05,
        low24h: currentPrice * 0.95,
        volume24h: Math.random() * 1000 + 500,
        timestamp: new Date().toISOString()
      }
    },
    orderBook,
    recentTrades
  };
};

// Generate a realistic order book
function generateOrderBook(midPrice, pricePrecision, quantityPrecision) {
  const asks = [];
  const bids = [];
  
  // Number of orders on each side
  const numOrders = 30;
  
  // Spread as a percentage of price
  const spreadPercentage = 0.001; // 0.1%
  const spread = midPrice * spreadPercentage;
  
  // Best ask and bid prices
  const bestAskPrice = midPrice + spread / 2;
  const bestBidPrice = midPrice - spread / 2;
  
  // Generate asks (sell orders) - higher than midPrice
  for (let i = 0; i < numOrders; i++) {
    // Price increases as we go up the book
    const price = bestAskPrice * (1 + 0.0005 * i);
    
    // Generate a reasonable quantity with some randomness
    // Higher prices typically have less quantity
    const baseQuantity = (1 / (1 + i/40)) * 10;
    const quantity = baseQuantity * (0.6 + Math.random() * 0.8);
    
    asks.push({
      price: parseFloat(price.toFixed(pricePrecision)),
      quantity: parseFloat(quantity.toFixed(quantityPrecision)),
      total: parseFloat((price * quantity).toFixed(2))
    });
  }
  
  // Generate bids (buy orders) - lower than midPrice
  for (let i = 0; i < numOrders; i++) {
    // Price decreases as we go down the book
    const price = bestBidPrice * (1 - 0.0005 * i);
    
    // Generate a reasonable quantity with some randomness
    // Lower prices typically have more quantity
    const baseQuantity = (1 + i/40) * 10;
    const quantity = baseQuantity * (0.6 + Math.random() * 0.8);
    
    bids.push({
      price: parseFloat(price.toFixed(pricePrecision)),
      quantity: parseFloat(quantity.toFixed(quantityPrecision)),
      total: parseFloat((price * quantity).toFixed(2))
    });
  }
  
  // Sort asks ascending by price, bids descending
  asks.sort((a, b) => a.price - b.price);
  bids.sort((a, b) => b.price - a.price);
  
  return { asks, bids };
}

// Generate recent trades
function generateRecentTrades(symbol, currentPrice, pricePrecision, quantityPrecision) {
  const trades = [];
  const numTrades = 40;
  const now = new Date();
  
  for (let i = 0; i < numTrades; i++) {
    // Random price around current price
    const priceVariation = (Math.random() - 0.5) * 0.002; // +/- 0.1%
    const price = currentPrice * (1 + priceVariation);
    
    // Random quantity
    const quantity = Math.random() * 5 + 0.1;
    
    // Random side
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    
    // Time in the past (more recent trades first)
    const seconds = Math.floor(Math.random() * 10) + i * 15;
    const time = new Date(now.getTime() - seconds * 1000);
    
    trades.push({
      id: `trade_${Date.now()}_${i}`,
      symbol,
      price: parseFloat(price.toFixed(pricePrecision)),
      quantity: parseFloat(quantity.toFixed(quantityPrecision)),
      total: parseFloat((price * quantity).toFixed(2)),
      side,
      time: time.toISOString(),
      maker: Math.random() > 0.7 // 30% are maker orders
    });
  }
  
  // Sort by time, most recent first
  return trades.sort((a, b) => new Date(b.time) - new Date(a.time));
}

// Generate order history for a user
export const generateOrderHistory = (userId, numOrders = 20) => {
  const orders = [];
  const now = new Date();
  
  // Possible symbols, types, and sides
  const symbols = mockAssets.map(a => a.symbol);
  const types = ['market', 'limit', 'stop', 'stop_limit'];
  const sides = ['buy', 'sell'];
  const statuses = ['open', 'filled', 'partially_filled', 'canceled', 'rejected'];
  
  for (let i = 0; i < numOrders; i++) {
    // Random selections
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    
    // Status weighted toward filled for older orders
    const statusIndex = Math.floor(Math.random() * (i < numOrders / 2 ? 1 : 5));
    const status = statuses[statusIndex];
    
    // More recent orders for lower i values
    const daysAgo = Math.floor(Math.random() * 30) + (i * 2);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Find the asset to get price details
    const asset = mockAssets.find(a => a.symbol === symbol) || mockAssets[0];
    
    // Generate a reasonable price based on the asset
    let basePrice;
    switch (asset.id) {
      case 'BTC': basePrice = 65000; break;
      case 'ETH': basePrice = 3450; break;
      default: basePrice = 100;
    }
    
    // Add some historical variation
    const historicalPrice = basePrice * (1 + (daysAgo / 100) * (Math.random() > 0.5 ? 1 : -1));
    
    // Random quantity based on asset price (higher price, lower quantity)
    const quantity = (10000 / historicalPrice) * (Math.random() * 0.5 + 0.5);
    
    const order = {
      id: `order_${Date.now()}_${i}`,
      userId,
      symbol,
      type,
      side,
      price: type === 'market' ? null : parseFloat(historicalPrice.toFixed(asset.pricePrecision)),
      stopPrice: ['stop', 'stop_limit'].includes(type) ? 
        parseFloat((historicalPrice * (side === 'buy' ? 1.01 : 0.99)).toFixed(asset.pricePrecision)) : 
        null,
      quantity: parseFloat(quantity.toFixed(asset.quantityPrecision)),
      filled: status === 'filled' ? parseFloat(quantity.toFixed(asset.quantityPrecision)) : 
             status === 'partially_filled' ? parseFloat((quantity * (Math.random() * 0.8 + 0.1)).toFixed(asset.quantityPrecision)) : 
             0,
      status,
      createdAt: createdAt.toISOString(),
      updatedAt: status !== 'open' ? 
        new Date(createdAt.getTime() + Math.floor(Math.random() * 10000000)).toISOString() : 
        createdAt.toISOString()
    };
    
    // Add execution price for filled or partially filled orders
    if (['filled', 'partially_filled'].includes(status)) {
      const executionPriceVariation = (Math.random() - 0.5) * 0.01; // +/- 0.5%
      order.executionPrice = type === 'market' ? 
        parseFloat((historicalPrice * (1 + executionPriceVariation)).toFixed(asset.pricePrecision)) : 
        order.price;
    }
    
    orders.push(order);
  }
  
  // Sort by createdAt, most recent first
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Generate trading portfolio data
export const generatePortfolioData = (userId) => {
  // Base assets in portfolio
  return {
    balances: [
      { asset: 'USD', free: 25000.50, locked: 5000.25 },
      { asset: 'BTC', free: 0.75, locked: 0.1 },
      { asset: 'ETH', free: 5.25, locked: 0.5 },
      { asset: 'LTC', free: 15.0, locked: 0 },
      { asset: 'XRP', free: 2500, locked: 0 }
    ],
    openPositions: [
      {
        id: `pos_${Date.now()}_1`,
        userId,
        symbol: 'BTC/USD',
        side: 'long',
        entryPrice: 60200.50,
        currentPrice: 65000.25,
        quantity: 0.5,
        leverage: 10,
        liquidationPrice: 54200.75,
        unrealizedPnl: 2399.88,
        unrealizedPnlPercentage: 7.98,
        margin: 3010.03,
        openedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `pos_${Date.now()}_2`,
        userId,
        symbol: 'ETH/USD',
        side: 'short',
        entryPrice: 3650.75,
        currentPrice: 3450.50,
        quantity: 2.5,
        leverage: 5,
        liquidationPrice: 4015.83,
        unrealizedPnl: 500.63,
        unrealizedPnlPercentage: 5.48,
        margin: 1825.38,
        openedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    tradingStats: {
      totalTrades: 156,
      winRate: 68.5,
      totalProfit: 12500.75,
      totalLoss: 4500.25,
      netProfit: 8000.50,
      bestTrade: 3250.00,
      worstTrade: -1200.50,
      averageProfit: 117.65,
      averageLoss: -75.00,
      profitFactor: 2.78,
      sharpeRatio: 1.45,
      maxDrawdown: 22.5,
      averageHoldingTime: '4h 35m'
    }
  };
};

// Function to retrieve sample candlestick data for a chart
export const getCandlestickData = async (symbol, timeframe, limit = 100) => {
  // Find the asset by symbol to get its price range
  const asset = mockAssets.find(a => a.symbol === symbol) || mockAssets[0];
  
  // Base price range by asset
  let basePrice;
  let volatility;
  
  switch (asset.id) {
    case 'BTC':
      basePrice = 65000;
      volatility = 0.05; // 5% daily volatility
      break;
    case 'ETH':
      basePrice = 3450;
      volatility = 0.06;
      break;
    case 'LTC':
      basePrice = 85;
      volatility = 0.055;
      break;
    case 'XRP':
      basePrice = 0.67;
      volatility = 0.08;
      break;
    case 'ADA':
      basePrice = 0.48;
      volatility = 0.07;
      break;
    case 'EURUSD':
      basePrice = 1.08;
      volatility = 0.005;
      break;
    case 'GBPUSD':
      basePrice = 1.25;
      volatility = 0.006;
      break;
    case 'US500':
      basePrice = 4580;
      volatility = 0.015;
      break;
    case 'US30':
      basePrice = 36000;
      volatility = 0.018;
      break;
    case 'XAUUSD':
      basePrice = 1950;
      volatility = 0.01;
      break;
    case 'XAGUSD':
      basePrice = 23.5;
      volatility = 0.02;
      break;
    default:
      basePrice = 100;
      volatility = 0.03;
  }
  
  // Adjust volatility based on timeframe
  let timeframeMultiplier;
  let intervalMs;
  
  switch (timeframe) {
    case '1m':
      timeframeMultiplier = 0.3;
      intervalMs = 60 * 1000;
      break;
    case '5m':
      timeframeMultiplier = 0.4;
      intervalMs = 5 * 60 * 1000;
      break;
    case '15m':
      timeframeMultiplier = 0.5;
      intervalMs = 15 * 60 * 1000;
      break;
    case '30m':
      timeframeMultiplier = 0.6;
      intervalMs = 30 * 60 * 1000;
      break;
    case '1h':
      timeframeMultiplier = 0.7;
      intervalMs = 60 * 60 * 1000;
      break;
    case '4h':
      timeframeMultiplier = 0.85;
      intervalMs = 4 * 60 * 60 * 1000;
      break;
    case '1d':
      timeframeMultiplier = 1;
      intervalMs = 24 * 60 * 60 * 1000;
      break;
    case '1w':
      timeframeMultiplier = 1.5;
      intervalMs = 7 * 24 * 60 * 60 * 1000;
      break;
    default:
      timeframeMultiplier = 0.7;
      intervalMs = 60 * 60 * 1000; // Default to 1h
  }
  
  // Adjust volatility for the timeframe
  volatility = volatility * timeframeMultiplier;
  
  // Generate a realistic price pattern with trend changes
  const generateCandlesticks = () => {
    const candles = [];
    const now = new Date();
    
    // Current price starts at the base price
    let currentPrice = basePrice;
    // Pick a random initial trend direction (-1 for down, 1 for up)
    let trendDirection = Math.random() > 0.5 ? 1 : -1;
    // Trend strength (determines how likely we are to continue in trend direction)
    let trendStrength = 0.6 + Math.random() * 0.2; // 0.6 to 0.8
    // Trend duration in candles
    let trendRemaining = Math.floor(Math.random() * 20) + 10; // 10 to 30 candles
    
    for (let i = 0; i < limit; i++) {
      // Decrement trend counter
      trendRemaining--;
      
      // Maybe change trend if the trend is expired
      if (trendRemaining <= 0) {
        trendDirection = trendDirection * -1; // Reverse trend
        trendStrength = 0.6 + Math.random() * 0.2; // New trend strength
        trendRemaining = Math.floor(Math.random() * 20) + 10; // New trend duration
      }
      
      // Calculate the candle's open price (previous close or initial price)
      const open = i === 0 ? currentPrice : candles[i - 1].close;
      
      // Calculate price movement for this candle
      // More likely to move in trend direction
      const trendBias = Math.random() < trendStrength ? trendDirection : -trendDirection;
      const priceChange = open * volatility * (Math.random() * 0.8 + 0.2) * trendBias;
      
      // Calculate close price
      const close = open + priceChange;
      
      // Calculate high and low with some randomness
      const rangeExtensionFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
      const high = Math.max(open, close) + (Math.abs(close - open) * rangeExtensionFactor * Math.random());
      const low = Math.min(open, close) - (Math.abs(close - open) * rangeExtensionFactor * Math.random());
      
      // Generate random volume, higher on bigger price moves
      const volumeBase = Math.max(Math.abs(priceChange) / open, 0.001) * 1000;
      const volume = volumeBase * (Math.random() * 1.5 + 0.5);
      
      // Calculate timestamp for this candle
      const timestamp = new Date(now.getTime() - ((limit - i) * intervalMs));
      
      candles.push({
        time: Math.floor(timestamp.getTime() / 1000),
        open: parseFloat(open.toFixed(asset.pricePrecision)),
        high: parseFloat(high.toFixed(asset.pricePrecision)),
        low: parseFloat(low.toFixed(asset.pricePrecision)),
        close: parseFloat(close.toFixed(asset.pricePrecision)),
        volume: parseFloat(volume.toFixed(2))
      });
      
      // Set current price to close for next candle's calculations
      currentPrice = close;
    }
    
    return candles;
  };
  
  // Generate the candlestick data
  const candles = generateCandlesticks();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    symbol,
    timeframe,
    candles
  };
};

// Generate mock trading signals
export const generateTradingSignals = (symbol) => {
  const signals = [];
  const signalTypes = ['buy', 'sell', 'strong_buy', 'strong_sell', 'neutral'];
  const timeframes = ['1h', '4h', '1d', '1w'];
  const indicators = ['RSI', 'MACD', 'MA Cross', 'Bollinger Bands', 'Ichimoku Cloud'];
  
  // Generate a mix of signals
  for (let i = 0; i < timeframes.length; i++) {
    for (let j = 0; j < 3; j++) { // 3 random signals per timeframe
      const indicator = indicators[Math.floor(Math.random() * indicators.length)];
      const signalType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
      
      signals.push({
        id: `signal_${Date.now()}_${i}_${j}`,
        symbol,
        timeframe: timeframes[i],
        indicator,
        type: signalType,
        price: null, // Will be set when used with current price
        confidence: Math.floor(Math.random() * 40) + 60, // 60-99%
        timestamp: new Date().toISOString(),
        details: `${indicator} indicates ${signalType.replace('_', ' ')} on ${timeframes[i]} timeframe`
      });
    }
  }
  
  return signals;
};
