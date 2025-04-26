import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaSearch, FaStar, FaChevronDown } from 'react-icons/fa';
import { 
  fetchTradingPairs,
  setSelectedSymbol, 
  selectTradingPairs,
  selectSelectedSymbol,
  toggleFavoriteSymbol,
  selectFavoriteSymbols
} from '../../redux/slices/tradingSlice';

const AssetSelector = ({ variant = 'full' }) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Redux state
  const tradingPairs = useSelector(selectTradingPairs);
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const favoriteSymbols = useSelector(selectFavoriteSymbols);
  
  // Local state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'favorites', 'crypto', 'stocks', 'forex'
  
  // Fetch trading pairs if not already loaded
  useEffect(() => {
    if (tradingPairs.length === 0) {
      dispatch(fetchTradingPairs());
    }
  }, [dispatch, tradingPairs.length]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownOpen]);
  
  // Handle symbol selection
  const handleSelectSymbol = (symbol) => {
    dispatch(setSelectedSymbol(symbol));
    setDropdownOpen(false);
    setSearchTerm('');
  };
  
  // Handle toggling favorites
  const handleToggleFavorite = (e, symbol) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    dispatch(toggleFavoriteSymbol(symbol));
  };
  
  // Filter trading pairs based on search term and active tab
  const getFilteredPairs = () => {
    let filtered = [...tradingPairs];
    
    // Filter by active tab
    switch (activeTab) {
      case 'favorites':
        filtered = filtered.filter(pair => favoriteSymbols.includes(pair.symbol));
        break;
      case 'crypto':
        filtered = filtered.filter(pair => pair.type === 'crypto');
        break;
      case 'stocks':
        filtered = filtered.filter(pair => pair.type === 'stock');
        break;
      case 'forex':
        filtered = filtered.filter(pair => pair.type === 'forex');
        break;
      default:
        break;
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pair => 
        pair.symbol.toLowerCase().includes(term) || 
        pair.name?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  // Get selected pair details
  const getSelectedPairDetails = () => {
    if (!selectedSymbol) return { symbol: 'Select Pair', lastPrice: 0, priceChange: 0 };
    
    const pair = tradingPairs.find(p => p.symbol === selectedSymbol);
    return pair || { symbol: selectedSymbol, lastPrice: 0, priceChange: 0 };
  };
  
  // Format price with appropriate decimal places
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
  
  // Format price change percentage
  const formatPriceChange = (change) => {
    if (typeof change !== 'number' || isNaN(change)) return '+0.00%';
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };
  
  // Selected pair details
  const selectedPair = getSelectedPairDetails();
  const filteredPairs = getFilteredPairs();
  
  // Minimal variant for chart headers
  if (variant === 'minimal') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 flex items-center gap-1 text-white text-sm"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedSymbol || 'Select Pair'}
          <FaChevronDown size={10} className="opacity-70" />
        </button>
        
        {dropdownOpen && (
          <div className="absolute z-50 top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-72">
            <div className="p-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredPairs.length > 0 ? (
                filteredPairs.map(pair => (
                  <div
                    key={pair.symbol}
                    className={`px-3 py-2 flex justify-between items-center hover:bg-gray-700 cursor-pointer ${
                      pair.symbol === selectedSymbol ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => handleSelectSymbol(pair.symbol)}
                  >
                    <div className="flex items-center">
                      <button
                        className="text-gray-400 hover:text-yellow-400 mr-1.5"
                        onClick={(e) => handleToggleFavorite(e, pair.symbol)}
                      >
                        <FaStar 
                          size={12} 
                          className={favoriteSymbols.includes(pair.symbol) ? 'text-yellow-400' : ''}
                        />
                      </button>
                      <span className="font-medium text-white">{pair.symbol}</span>
                    </div>
                    <div className={`text-sm ${pair.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPriceChange(pair.priceChange)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-400 text-sm">
                  No pairs found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Full variant
  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer ${
          dropdownOpen ? 'ring-2 ring-primary-500' : 'hover:bg-gray-700'
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="flex items-center">
          <div className="mr-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              {selectedPair.symbol.substring(0, 1)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{selectedPair.symbol}</h3>
            <div className={`text-sm ${selectedPair.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPrice(selectedPair.lastPrice)} {formatPriceChange(selectedPair.priceChange)}
            </div>
          </div>
        </div>
        <div>
          <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {dropdownOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl">
          <div className="p-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pairs..."
                className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border-b border-gray-700">
            <div className="flex overflow-x-auto">
              <button
                className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'all' 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'favorites' 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites
              </button>
              <button
                className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'crypto' 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('crypto')}
              >
                Crypto
              </button>
              <button
                className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'stocks' 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('stocks')}
              >
                Stocks
              </button>
              <button
                className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'forex' 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('forex')}
              >
                Forex
              </button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="pl-4 pr-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pair
                  </th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredPairs.length > 0 ? (
                  filteredPairs.map(pair => (
                    <tr
                      key={pair.symbol}
                      className={`hover:bg-gray-700 cursor-pointer ${pair.symbol === selectedSymbol ? 'bg-gray-700' : ''}`}
                      onClick={() => handleSelectSymbol(pair.symbol)}
                    >
                      <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            className="text-gray-400 hover:text-yellow-400 mr-2"
                            onClick={(e) => handleToggleFavorite(e, pair.symbol)}
                          >
                            <FaStar 
                              size={14} 
                              className={favoriteSymbols.includes(pair.symbol) ? 'text-yellow-400' : ''}
                            />
                          </button>
                          <div>
                            <div className="font-medium text-white">{pair.symbol}</div>
                            <div className="text-xs text-gray-400">{pair.name || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-right">
                        <div className="text-white">{formatPrice(pair.lastPrice)}</div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-right">
                        <div className={`${pair.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPriceChange(pair.priceChange)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-gray-300">{(pair.volume || 0).toLocaleString()}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
                      No matching pairs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

AssetSelector.propTypes = {
  variant: PropTypes.oneOf(['full', 'minimal'])
};

export default AssetSelector;