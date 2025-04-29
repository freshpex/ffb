import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaSearch,
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaArrowUp,
  FaArrowDown,
  FaBell,
} from "react-icons/fa";
import {
  selectTradingPairs,
  selectSelectedSymbol,
  setSelectedSymbol,
  selectMarketPrices,
  selectFavoriteSymbols,
  toggleFavoriteSymbol,
  fetchMarketData,
} from "../../redux/slices/tradingSlice";

const TradingHeader = () => {
  const dispatch = useDispatch();
  const allAssets = useSelector(selectTradingPairs);
  const selectedAsset = useSelector(selectSelectedSymbol);
  const marketPrices = useSelector(selectMarketPrices);
  const favorites = useSelector(selectFavoriteSymbols);
  const dropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState(allAssets);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAssetSelector(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatPrice = (price) => {
    if (!price) return "0.00";
    let formatted;
    if (price < 1) {
      formatted = price.toFixed(6);
    } else if (price < 10) {
      formatted = price.toFixed(4);
    } else if (price < 1000) {
      formatted = price.toFixed(2);
    } else {
      formatted = price.toFixed(2);
    }
    return Number(formatted).toLocaleString(undefined, {
      minimumFractionDigits: formatted.split(".")[1]?.length || 0,
      maximumFractionDigits: formatted.split(".")[1]?.length || 0,
    });
  };

  // Get current price and price change based on the backend data structure
  const currentPrice = marketPrices[selectedAsset]?.price || 0;
  const priceChange = marketPrices[selectedAsset]?.priceChangePercent || 0;
  const isPriceUp = priceChange >= 0;

  // Filter assets based on search query and category
  useEffect(() => {
    let result = allAssets;

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
  }, [searchQuery, selectedCategory, allAssets]);

  // Handle asset selection
  const handleAssetSelect = (symbol) => {
    dispatch(setSelectedSymbol(symbol));
    setShowAssetSelector(false);
    dispatch(fetchMarketData(symbol));
  };

  // Toggle favorite
  const toggleFavorite = (symbol, e) => {
    e.stopPropagation();
    dispatch(toggleFavoriteSymbol(symbol));
  };

  return (
    <div className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Asset selector */}
        <div className="relative" ref={dropdownRef}>
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

              <div className="p-2 border-b border-gray-700 flex flex-wrap gap-1">
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
                          <div className="text-white font-medium">
                            {asset.baseAsset}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {asset.symbol}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {/* <div className="text-white">
                          ${formatPrice(marketPrices[asset.symbol]?.price)}
                        </div> */}
                        {/* {marketPrices[asset.symbol] && (
                          <div
                            className={`text-xs ${
                              marketPrices[asset.symbol].priceChangePercent >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {marketPrices[asset.symbol].priceChangePercent >= 0
                              ? "+"
                              : ""}
                            {marketPrices[asset.symbol].priceChangePercent?.toFixed(
                              2
                            )}
                            %
                          </div>
                        )} */}
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

        {/* Price info */}
        <div className="flex items-center space-x-6">
          <div>
            <div className="text-gray-400 text-xs">Last Price</div>
            <div
              className={`text-2xl font-bold ${
                isPriceUp ? "text-green-500" : "text-red-500"
              }`}
            >
              ${formatPrice(currentPrice)}
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-xs">24h Change</div>
            <div
              className={`flex items-center ${
                isPriceUp ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPriceUp ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {isPriceUp ? "+" : ""}
              {priceChange.toFixed(2)}%
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-gray-400 text-xs">Market</div>
            <div className="text-white">
              {allAssets.find(a => a.symbol === selectedAsset)?.type || "N/A"}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-gray-400 text-xs">Min Quantity</div>
            <div className="text-white">
              {allAssets.find(a => a.symbol === selectedAsset)?.minQuantity || "N/A"}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-gray-400 text-xs">Quote Asset</div>
            <div className="text-white">
              {allAssets.find(a => a.symbol === selectedAsset)?.quoteAsset || "USDT"}
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
