import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaWallet,
  FaChevronUp,
  FaChevronDown,
  FaExchangeAlt,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import {
  fetchPortfolio,
  selectPortfolio,
  setSelectedSymbol,
} from "../../redux/slices/tradingSlice";

/**
 * AssetCards component displays user assets in a card-based layout.
 * Shows USDT balance by default and any additional assets user has purchased
 */
const AssetCards = ({
  variant = "standard", // 'standard', 'compact'
  maxItems = null,
  showHeader = true,
  className = "",
  onAssetClick = null,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { positions = [], balances = {} } = useSelector(selectPortfolio);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchPortfolio()).unwrap();
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [dispatch]);

  // Format currency values with the appropriate number of decimal places
  const formatCurrency = (value) => {
    if (typeof value !== "number") return "0.00";

    if (value >= 1000) {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else if (value >= 1) {
      return value.toFixed(2);
    } else if (value >= 0.01) {
      return value.toFixed(4);
    } else {
      return value.toFixed(8);
    }
  };

  // Get appropriate icon for the crypto asset
  const getAssetIcon = (symbol) => {
    const assetSymbol = symbol?.split("/")?.[0] || symbol;

    switch (assetSymbol) {
      case "BTC":
        return (
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
            ₿
          </div>
        );
      case "ETH":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            €
          </div>
        );
      case "USDT":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            $
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
            {assetSymbol.charAt(0)}
          </div>
        );
    }
  };

  // Handle asset card click - can be used for trade or detail view
  const handleAssetClick = (asset) => {
    if (onAssetClick) {
      onAssetClick(asset);
    } else {
      // Default behavior - navigate to trading view with selected asset
      const symbol = asset.symbol || `${asset.asset}/USDT`;
      dispatch(setSelectedSymbol(symbol));
      navigate(`/login/trading?symbol=${symbol}`);
    }
  };

  // Get all assets from positions and balances
  const getAssets = () => {
    const assets = [];

    // Always include USDT balance first
    const usdtBalance = balances.USDT || balances.USD || 0;
    assets.push({
      asset: "USDT",
      symbol: "USDT",
      balance: usdtBalance,
      value: usdtBalance,
      pnl: 0,
      pnlPercentage: 0,
      isStablecoin: true,
    });

    // Add other assets from positions
    for (const position of positions) {
      const [asset] = position.symbol.split("/");
      assets.push({
        asset,
        symbol: position.symbol,
        balance: position.amount,
        value: position.value,
        price: position.currentPrice,
        pnl: position.pnl || 0,
        pnlPercentage: position.pnlPercentage || 0,
        isStablecoin: false,
      });
    }

    // Add any additional balances not in positions
    for (const [asset, balance] of Object.entries(balances)) {
      if (
        asset !== "USDT" &&
        asset !== "USD" &&
        !assets.find((a) => a.asset === asset)
      ) {
        // For assets without position data, we don't have price/value info
        assets.push({
          asset,
          symbol: `${asset}/USDT`,
          balance,
          value: 0, // We don't have this information
          price: 0, // We don't have this information
          pnl: 0,
          pnlPercentage: 0,
          isStablecoin: ["USDC", "BUSD", "DAI"].includes(asset), // Check if it's a stablecoin
        });
      }
    }

    return assets;
  };

  const assets = getAssets();
  const displayAssets = maxItems ? assets.slice(0, maxItems) : assets;

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        {showHeader && (
          <h3 className="text-lg font-medium text-white mb-4">My Assets</h3>
        )}
        <div className="flex items-center justify-center py-10">
          <FaSpinner className="animate-spin text-primary-500 text-2xl" />
          <span className="ml-3 text-gray-300">Loading assets...</span>
        </div>
      </div>
    );
  }

  // Empty state - unlikely since we always have USDT but just in case
  if (!assets || assets.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        {showHeader && (
          <h3 className="text-lg font-medium text-white mb-4">My Assets</h3>
        )}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FaWallet className="text-gray-400 text-4xl mb-3" />
          <p className="text-gray-300 text-lg mb-2">No assets found</p>
          <p className="text-gray-400 mb-4">
            Your assets will appear here once you deposit or trade.
          </p>
          <button
            onClick={() => navigate("/account/deposit")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Make a Deposit
          </button>
        </div>
      </div>
    );
  }

  // Compact variant (for dashboards, sidebars)
  if (variant === "compact") {
    return (
      <div className={`bg-gray-800 rounded-lg ${className}`}>
        {showHeader && (
          <h3 className="text-lg font-medium text-white p-4">My Assets</h3>
        )}

        <div className="divide-y divide-gray-700">
          {displayAssets.map((asset, index) => (
            <div
              key={asset.asset || index}
              className="p-3 hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => handleAssetClick(asset)}
            >
              <div className="flex items-center">
                <div className="mr-3">{getAssetIcon(asset.asset)}</div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-white">
                      {asset.asset}
                      {asset.isStablecoin && (
                        <span className="ml-1 text-xs text-gray-400">
                          (Stable)
                        </span>
                      )}
                    </p>
                    <p className="text-white font-medium">
                      {formatCurrency(asset.balance)}
                    </p>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      {asset.price > 0 ? `$${formatCurrency(asset.price)}` : ""}
                    </span>
                    {asset.pnl !== 0 && (
                      <span
                        className={`flex items-center ${asset.pnl >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {asset.pnl >= 0 ? (
                          <FaChevronUp size={10} className="mr-1" />
                        ) : (
                          <FaChevronDown size={10} className="mr-1" />
                        )}
                        {Math.abs(asset.pnlPercentage).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-700">
          <button
            onClick={() => navigate("/login/trading")}
            className="w-full py-2 text-center text-primary-500 hover:text-primary-400 font-medium flex items-center justify-center"
          >
            Trade Assets <FaArrowRight className="ml-2" size={12} />
          </button>
        </div>
      </div>
    );
  }

  // Standard variant (default)
  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">My Assets</h3>
          <button
            onClick={() => navigate("/login/trading")}
            className="text-primary-500 hover:text-primary-400 text-sm flex items-center"
          >
            Trade <FaArrowRight className="ml-1" size={12} />
          </button>
        </div>
      )}

      {/* Grid layout for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayAssets.map((asset, index) => (
          <div
            key={asset.asset || index}
            className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => handleAssetClick(asset)}
          >
            <div className="flex items-start">
              <div className="mr-3">{getAssetIcon(asset.asset)}</div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-white text-lg">
                    {asset.asset}
                  </p>
                  {asset.pnl !== 0 && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded flex items-center ${
                        asset.pnl >= 0
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {asset.pnl >= 0 ? (
                        <FaChevronUp size={8} className="mr-1" />
                      ) : (
                        <FaChevronDown size={8} className="mr-1" />
                      )}
                      {Math.abs(asset.pnlPercentage).toFixed(2)}%
                    </span>
                  )}
                </div>

                <p className="text-2xl font-semibold text-white mb-2">
                  {formatCurrency(asset.balance)}{" "}
                  <span className="text-sm font-normal text-gray-400">
                    {asset.asset}
                  </span>
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {asset.value > 0 ? `≈ $${formatCurrency(asset.value)}` : ""}
                  </span>
                  <button
                    className="flex items-center text-primary-500 hover:text-primary-400 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetClick(asset);
                    }}
                  >
                    <FaExchangeAlt className="mr-1" size={12} /> Trade
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AssetCards.propTypes = {
  variant: PropTypes.oneOf(["standard", "compact"]),
  maxItems: PropTypes.number,
  showHeader: PropTypes.bool,
  className: PropTypes.string,
  onAssetClick: PropTypes.func,
};

export default AssetCards;
