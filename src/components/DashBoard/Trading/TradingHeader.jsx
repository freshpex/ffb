import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  FaChartBar, 
  FaBook, 
  FaTh, 
  FaStar, 
  FaRegStar, 
  FaCog, 
  FaChevronDown,
  FaDesktop,
  FaChartLine,
  FaTable
} from 'react-icons/fa';
import { 
  selectSelectedAsset, 
  selectMarketPrices, 
  toggleMarketFavorite,
  selectAvailableAssets 
} from '../../../redux/slices/tradingSlice';

const TradingHeader = ({ layout, setLayout, mobileTab, setMobileTab }) => {
  const selectedAsset = useSelector(selectSelectedAsset);
  const marketData = useSelector(selectMarketPrices);
  const tradingPairs = useSelector(selectAvailableAssets);
  
  const [showDropdown, setShowDropdown] = useState(false);
  
  const currentSymbolData = selectedAsset && marketData ? 
    marketData[selectedAsset] : null;
  
  const currentPairData = selectedAsset ? 
    tradingPairs.find(pair => pair.symbol === selectedAsset) : null;
  
  // Format price with appropriate precision
  const formatPrice = (price) => {
    if (!price) return '-';
    if (!currentPairData) return price.toLocaleString();
    
    return price.toFixed(currentPairData.pricePrecision);
  };
  
  // Price change percentage formatter
  const formatChange = (change) => {
    if (!change && change !== 0) return '-';
    
    return (
      <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };
  
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        {/* Symbol information */}
        <div className="flex items-center mr-4 mb-3 sm:mb-0">
          <div className="mr-3">
            <h1 className="text-xl font-bold text-white flex items-center">
              {selectedAsset || 'Select a Market'}
              <button 
                className="ml-2 text-gray-400 hover:text-yellow-400 focus:outline-none"
                onClick={() => {
                  /* Handle favorite toggle */
                }}
              >
                {currentSymbolData?.isFavorite ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
              </button>
            </h1>
            {currentSymbolData && (
              <div className="flex items-center text-sm">
                <span className="text-gray-300 mr-3">Last: {formatPrice(currentSymbolData.current)}</span>
                <span className="mr-3">{formatChange(currentSymbolData.change)}</span>
                <span className="text-gray-400">24h Vol: {currentSymbolData.volume24h?.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center">
          {/* Layout options */}
          <div className="bg-gray-700 rounded-lg p-1 mr-3 hidden md:flex">
            <button 
              className={`p-2 rounded ${layout === 'standard' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setLayout('standard')}
              title="Standard View"
            >
              <FaTh size={16} />
            </button>
            <button 
              className={`p-2 rounded ${layout === 'chart' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setLayout('chart')}
              title="Chart Focus"
            >
              <FaChartLine size={16} />
            </button>
            <button 
              className={`p-2 rounded ${layout === 'orderbook' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setLayout('orderbook')}
              title="Orderbook Focus"
            >
              <FaTable size={16} />
            </button>
          </div>
          
          {/* Mobile tab selection - only visible on small screens */}
          <div className="bg-gray-700 rounded-lg p-1 mr-3 flex sm:hidden">
            <button 
              className={`p-2 rounded ${mobileTab === 'chart' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setMobileTab('chart')}
              title="Chart"
            >
              <FaChartBar size={16} />
            </button>
            <button 
              className={`p-2 rounded ${mobileTab === 'orderbook' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setMobileTab('orderbook')}
              title="Orderbook"
            >
              <FaBook size={16} />
            </button>
            <button 
              className={`p-2 rounded ${mobileTab === 'order' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setMobileTab('order')}
              title="Place Order"
            >
              <FaCog size={16} />
            </button>
          </div>
          
          {/* Settings dropdown */}
          <div className="relative">
            <button 
              className="flex items-center justify-between bg-gray-700 rounded-lg py-2 px-3 text-gray-300 hover:text-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaCog className="mr-2" />
              <span className="mr-1">Settings</span>
              <FaChevronDown size={12} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-20">
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                    <FaDesktop className="mr-2" /> Trading Preferences
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                    <FaChartLine className="mr-2" /> Chart Settings
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TradingHeader.propTypes = {
  layout: PropTypes.string.isRequired,
  setLayout: PropTypes.func.isRequired,
  mobileTab: PropTypes.string.isRequired,
  setMobileTab: PropTypes.func.isRequired
};

export default TradingHeader;
