import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaInfoCircle, 
  FaSearch, FaArrowUp, FaArrowDown, FaSpinner, FaHistory
} from 'react-icons/fa';
import AdvancedTradingView from './AdvancedTradingView';
import LiveOrderbook from './LiveOrderbook';
import binanceService from '../../services/binanceService';
import DashboardLayout from './DashboardLayout';

const TradingDashboard = () => {
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [marketPairs, setMarketPairs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange24h, setPriceChange24h] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [activePairCategory, setActivePairCategory] = useState('USDT');
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        // Get list of all trading pairs
        const exchangeInfo = await binanceService.getExchangeInfo();
        
        // Group by quote asset (USDT, BTC, ETH, etc)
        const pairs = {};
        exchangeInfo.symbols.forEach(symbol => {
          if (symbol.status === 'TRADING') {
            const quote = symbol.quoteAsset;
            if (!pairs[quote]) pairs[quote] = [];
            pairs[quote].push({
              symbol: symbol.symbol,
              baseAsset: symbol.baseAsset,
              quoteAsset: symbol.quoteAsset
            });
          }
        });
        
        setMarketPairs(pairs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);
  
  useEffect(() => {
    // Get current price and 24h change for the selected symbol
    const fetchSymbolDetails = async () => {
      try {
        const stats = await binanceService.get24hrStats(activeSymbol);
        setCurrentPrice(parseFloat(stats.lastPrice));
        setPriceChange24h({
          percent: parseFloat(stats.priceChangePercent),
          absolute: parseFloat(stats.priceChange)
        });
      } catch (err) {
        console.error(`Error fetching details for ${activeSymbol}:`, err);
      }
    };
    
    // Get recent trades for the selected symbol
    const fetchRecentTrades = async () => {
      try {
        const trades = await binanceService.getRecentTrades(activeSymbol, 15);
        
        // Format trade data
        const formattedTrades = trades.map(trade => ({
          id: trade.id,
          price: parseFloat(trade.price),
          quantity: parseFloat(trade.qty),
          time: new Date(trade.time),
          isBuyerMaker: trade.isBuyerMaker
        }));
        
        setTradeHistory(formattedTrades);
      } catch (err) {
        console.error(`Error fetching trades for ${activeSymbol}:`, err);
      }
    };
    
    if (activeSymbol) {
      fetchSymbolDetails();
      fetchRecentTrades();
      
      // Set up intervals for real-time updates
      const priceInterval = setInterval(fetchSymbolDetails, 5000);
      const tradesInterval = setInterval(fetchRecentTrades, 10000);
      
      return () => {
        clearInterval(priceInterval);
        clearInterval(tradesInterval);
      };
    }
  }, [activeSymbol]);
  
  // Filter market pairs based on search query
  const filteredPairs = activePairCategory && marketPairs[activePairCategory]
    ? marketPairs[activePairCategory].filter(pair => 
        pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.baseAsset.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <DashboardLayout>
      <motion.div 
        className="trading-dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="trading-dashboard-header">
          <div className="symbol-info">
            <h1>{activeSymbol.replace('USDT', '/USDT')}</h1>
            
            {currentPrice && (
              <div className="price-container">
                <div className="current-price">${currentPrice.toLocaleString()}</div>
                <div className={`price-change ${priceChange24h?.percent >= 0 ? 'positive' : 'negative'}`}>
                  {priceChange24h?.percent >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(priceChange24h?.percent).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="trading-dashboard-content">
          <div className="main-chart-area">
            <AdvancedTradingView symbol={activeSymbol} />
          </div>
          
          <div className="sidebar-panels">
            <div className="market-pairs-panel">
              <div className="panel-header">
                <h3>Market Pairs</h3>
                <div className="search-input">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="quote-asset-tabs">
                {marketPairs && Object.keys(marketPairs).map(quote => (
                  <button
                    key={quote}
                    className={`quote-tab ${activePairCategory === quote ? 'active' : ''}`}
                    onClick={() => setActivePairCategory(quote)}
                  >
                    {quote}
                  </button>
                ))}
              </div>
              
              <div className="pairs-list">
                {isLoading ? (
                  <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <span>Loading pairs...</span>
                  </div>
                ) : (
                  filteredPairs.length > 0 ? (
                    filteredPairs.map(pair => (
                      <div
                        key={pair.symbol}
                        className={`pair-item ${activeSymbol === pair.symbol ? 'active' : ''}`}
                        onClick={() => setActiveSymbol(pair.symbol)}
                      >
                        <span className="pair-name">{pair.baseAsset}</span>
                        <span className="pair-price"></span>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No pairs found matching {searchQuery}</p>
                    </div>
                  )
                )}
              </div>
            </div>
            
            <div className="orderbook-panel">
              <div className="panel-header">
                <h3>Order Book</h3>
              </div>
              <LiveOrderbook symbol={activeSymbol} />
            </div>
            
            <div className="trades-panel">
              <div className="panel-header">
                <h3>Recent Trades</h3>
                <FaHistory />
              </div>
              
              <div className="trades-list">
                <div className="trade-header">
                  <span>Price</span>
                  <span>Amount</span>
                  <span>Time</span>
                </div>
                
                <div className="trade-rows">
                  {tradeHistory.map(trade => (
                    <div 
                      key={trade.id}
                      className={`trade-row ${trade.isBuyerMaker ? 'sell' : 'buy'}`}
                    >
                      <span className="trade-price">
                        {trade.price.toFixed(2)}
                      </span>
                      <span className="trade-amount">
                        {trade.quantity.toFixed(6)}
                      </span>
                      <span className="trade-time">
                        {trade.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="trading-dashboard-footer">
          <div className="disclaimer">
            <FaInfoCircle />
            <span>Trading involves risk. Make sure you understand the risks before trading. Data provided by Binance API.</span>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TradingDashboard;
