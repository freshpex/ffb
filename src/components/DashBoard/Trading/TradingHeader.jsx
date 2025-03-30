import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaSearch, 
  FaStar, 
  FaRegStar,
  FaChevronDown, 
  FaArrowUp, 
  FaArrowDown,
  FaBell
} from 'react-icons/fa';
import { 
  selectAvailableAssets, 
  selectSelectedAsset, 
  setSelectedAsset, 
  selectMarketPrices,
  fetchMarketData
} from '../../../redux/slices/tradingSlice';

const TradingHeader = () => {
  const dispatch = useDispatch();
  const allAssets = selectAvailableAssets();
  const selectedAsset = useSelector(selectSelectedAsset);
  const marketPrices = useSelector(selectMarketPrices);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState(allAssets);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(['BTC/USD', 'ETH/USD']);
  
  // Format price with appropriate decimal places
  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (price < 1) return price.toFixed(6);
    if (price < 10) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return price.toFixed(2);
  };
  
  // Get current price and price change
  const currentPrice = marketPrices[selectedAsset]?.current || 0;
  const priceChange = marketPrices[selectedAsset]?.change || 0;
  const isPriceUp = priceChange >= 0;
  
  // Filter assets based on search query and category
  useEffect(() => {
    let result = allAssets;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(asset => asset.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        asset => asset.name.toLowerCase().includes(query) || 
                asset.symbol.toLowerCase().includes(query)
      );
    }
    
    setFilteredAssets(result);
  }, [searchQuery, selectedCategory, allAssets]);
  
  // Handle asset selection
  const handleAssetSelect = (symbol) => {
    dispatch(setSelectedAsset(symbol));
    setShowAssetSelector(false);
    dispatch(fetchMarketData(symbol));
  };
  
  // Toggle favorite
  const toggleFavorite = (symbol, e) => {
    e.stopPropagation();
    if (favorites.includes(symbol)) {
      setFavorites(favorites.filter(s => s !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }
  };
  
  return (
    <div className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Asset selector */}
        <div className="relative">
          <button
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowAssetSelector(!showAssetSelector)}
          >
            <span className="font-medium">{selectedAsset}</span>
            <FaChevronDown className="ml-2 text-gray-400" />
          </button>
          
          {/* Asset selector dropdown */}
          {showAssetSelector && (
            <div className="absolute left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-700">
              <div className="p-3 border-b border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="p-2 border-b border-gray-700 flex space-x-1">
                <button
                  className={`px-3 py-1 text-xs rounded-lg ${
                    selectedCategory === 'all' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-lg ${
                    selectedCategory === 'crypto' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCategory('crypto')}
                >
                  Crypto
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-lg ${
                    selectedCategory === 'forex' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCategory('forex')}
                >
                  Forex
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-lg ${
                    selectedCategory === 'indices' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCategory('indices')}
                >
                  Indices
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-lg ${
                    selectedCategory === 'commodities' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCategory('commodities')}
                >
                  Commodities
                </button>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleAssetSelect(asset.symbol)}
                    >
                      <div className="flex items-center">
                        <button 
                          onClick={(e) => toggleFavorite(asset.symbol, e)}
                          className="text-gray-400 hover:text-yellow-500 mr-2"
                        >
                          {favorites.includes(asset.symbol) ? (
                            <FaStar className="text-yellow-500" />
                          ) : (
                            <FaRegStar />
                          )}
                        </button>
                        <div>
                          <div className="text-white font-medium">{asset.name}</div>
                          <div className="text-gray-400 text-sm">{asset.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white">${formatPrice(marketPrices[asset.symbol]?.current)}</div>
                        {marketPrices[asset.symbol] && (
                          <div className={`text-xs ${marketPrices[asset.symbol].change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {marketPrices[asset.symbol].change >= 0 ? '+' : ''}
                            {marketPrices[asset.symbol].change.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-400">No assets found matching your criteria</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Price info */}
        <div className="flex items-center space-x-6">
          <div>
            <div className="text-gray-400 text-xs">Last Price</div>
            <div className={`text-2xl font-bold ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
              ${formatPrice(currentPrice)}
            </div>
          </div>
          
          <div>
            <div className="text-gray-400 text-xs">24h Change</div>
            <div className={`flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
              {isPriceUp ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {isPriceUp ? '+' : ''}
              {priceChange.toFixed(2)}%
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="text-gray-400 text-xs">24h High</div>
            <div className="text-white">
              ${formatPrice(marketPrices[selectedAsset]?.high24h || 0)}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="text-gray-400 text-xs">24h Low</div>
            <div className="text-white">
              ${formatPrice(marketPrices[selectedAsset]?.low24h || 0)}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="text-gray-400 text-xs">24h Volume</div>
            <div className="text-white">
              ${(marketPrices[selectedAsset]?.volume24h || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        
        {/* Alert button */}
        <div className="hidden md:block">
          <button 
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
            title="Create price alert"
          >
            <FaBell className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingHeader;
