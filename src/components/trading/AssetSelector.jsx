import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaStar, FaRegStar, FaChevronDown } from "react-icons/fa";
import {
  selectTradingPairs,
  selectSelectedSymbol,
  setSelectedSymbol,
  selectMarketPrices,
  selectFavoriteSymbols,
  toggleFavoriteSymbol,
  fetchMarketData,
  fetchTradingPairs,
} from "../../redux/slices/tradingSlice";

const AssetSelector = ({ variant = "standard", compact = false }) => {
  const dispatch = useDispatch();
  const allAssets = useSelector(selectTradingPairs);
  const selectedAsset = useSelector(selectSelectedSymbol);
  const marketPrices = useSelector(selectMarketPrices);
  const favorites = useSelector(selectFavoriteSymbols);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState(allAssets);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAssetSelector(false);
      }
    }

    if (showAssetSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAssetSelector]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTradingPairs());
    
    // Fetch initial market data for selected asset
    if (selectedAsset) {
      dispatch(fetchMarketData(selectedAsset));
    }
  }, [dispatch, selectedAsset]);

  // Format price with appropriate decimal places
  const formatPrice = (price) => {
    if (!price) return "0.00";
    if (price < 1) return price.toFixed(6);
    if (price < 10) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return price.toFixed(2);
  };

  // Get asset price
  const getAssetPrice = (symbol) => {
    return marketPrices[symbol]?.price;
  };

  // Filter assets based on search query and category
  useEffect(() => {
    if (!showAssetSelector) return;
    
    let result = [...allAssets];

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((asset) => asset.type === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (asset) =>
          asset.baseAsset.toLowerCase().includes(query) ||
          asset.symbol.toLowerCase().includes(query)
      );
    }

    setFilteredAssets(result);
  }, [searchQuery, selectedCategory, allAssets, showAssetSelector]);

  // Handle asset selection
  const handleAssetSelect = (symbol) => {
    dispatch(setSelectedSymbol(symbol));
    setShowAssetSelector(false);
    dispatch(fetchMarketData(symbol));
  };

  // Toggle dropdown with immediate state update
  const toggleDropdown = () => {
    const newState = !showAssetSelector;
    setShowAssetSelector(newState);
    
    // Pre-filter assets when opening dropdown
    if (newState) {
      let result = [...allAssets];
      if (selectedCategory !== "all") {
        result = result.filter((asset) => asset.type === selectedCategory);
      }
      setFilteredAssets(result);
    }
  };

  // Toggle favorite
  const toggleFavorite = (symbol, e) => {
    e.stopPropagation();
    dispatch(toggleFavoriteSymbol(symbol));
  };

  // Get asset display name
  const getAssetDisplayName = (asset) => {
    return asset.baseAsset;
  };

  // Minimal variant for sidebar display
  if (variant === "minimal") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className={`flex items-center ${
            compact
              ? "bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
              : "bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg"
          }`}
          onClick={toggleDropdown}
        >
          <span className="font-medium">{selectedAsset}</span>
          <span className="font-bold ml-1">
            ${formatPrice(getAssetPrice(selectedAsset))}
          </span>
          <FaChevronDown className="ml-2 text-gray-400" />
        </button>

        {showAssetSelector && (
          <div className="absolute left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-700 max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-1.5 rounded pl-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              </div>
            </div>

            <div>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-700 cursor-pointer"
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
                        <div className="text-white text-sm font-medium">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-sm">
                      {/* <div className="text-white">
                        ${formatPrice(getAssetPrice(asset.symbol))}
                      </div> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-400 text-sm">
                  No assets found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center ${
          compact
            ? "bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
            : "bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg"
        }`}
        onClick={toggleDropdown}
      >
        <span className="font-medium">{selectedAsset}</span>
        <span className="font-bold ml-1">
          ${formatPrice(getAssetPrice(selectedAsset))}
        </span>
        <FaChevronDown className="ml-2 text-gray-400" />
      </button>

      {/* Asset selector dropdown */}
      {showAssetSelector && (
        <div
          className={`absolute left-0 mt-2 ${compact ? "w-72" : "w-96"} bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-700`}
        >
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

          <div className="p-2 border-b border-gray-700 flex space-x-1 overflow-x-auto">
            <button
              className={`px-3 py-1 text-xs rounded-lg ${
                selectedCategory === "all"
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-lg ${
                selectedCategory === "crypto"
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory("crypto")}
            >
              Crypto
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-lg ${
                selectedCategory === "stock"
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory("stock")}
            >
              Stocks
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-lg ${
                selectedCategory === "etf"
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory("etf")}
            >
              ETFs
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-lg ${
                selectedCategory === "commodity"
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedCategory("commodity")}
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
                      <div className="text-white font-medium">{getAssetDisplayName(asset)}</div>
                      <div className="text-gray-400 text-sm">
                        {asset.symbol}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {/* <div className="text-white">
                      ${formatPrice(getAssetPrice(asset.symbol))}
                    </div> */}
                    {/* 
                      Note: Price change data doesn't appear to be in the market price data structure.
                      Removing the change display until that data is available.

                      {marketPrices[asset.symbol] && (
                      <div
                        className={`text-xs ${marketPrices[asset.symbol].change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {marketPrices[asset.symbol].change24h >= 0 ? "+" : ""}
                        {marketPrices[asset.symbol].change24h?.toFixed(2)}%
                      </div>
                    )}
                    */}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-gray-400">
                No assets found matching your criteria
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetSelector;
