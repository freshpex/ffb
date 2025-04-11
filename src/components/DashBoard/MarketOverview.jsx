import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaBitcoin, 
  FaEthereum, 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt, 
  FaArrowRight,
  FaDollarSign
} from 'react-icons/fa';
import { 
  fetchMarketPulse,
  selectMarketPulse,
  selectDashboardStatus
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';

const MarketOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const marketData = useSelector(selectMarketPulse);
  const status = useSelector(state => selectDashboardStatus(state, 'marketPulse'));
  
  useEffect(() => {
    // Fetch market data if not already loaded
    if (status !== 'succeeded') {
      dispatch(fetchMarketPulse());
    }
  }, [dispatch, status]);
  
  // Helper to get crypto icon
  const getCryptoIcon = (symbol) => {
    switch (symbol?.toUpperCase()) {
      case 'BTC':
        return <FaBitcoin className="text-orange-500" size={20} />;
      case 'ETH':
        return <FaEthereum className="text-blue-400" size={20} />;
      default:
        return <FaDollarSign className="text-gray-400" size={20} />;
    }
  };
  
  // If the component is loading, show a skeleton loader
  if (status === 'loading') {
    return <CardLoader title="Market Overview" height="h-72" />;
  }
  
  // Get trending assets from market data if available
  const trendingAssets = marketData?.trendingAssets || [];
  
  // Fallback data in case API doesn't return anything
  const fallbackAssets = [
    { symbol: 'BTC', name: 'Bitcoin', price: 60000, change: 2.5 },
    { symbol: 'ETH', name: 'Ethereum', price: 3000, change: -1.2 },
    { symbol: 'SOL', name: 'Solana', price: 120, change: 5.7 },
    { symbol: 'MATIC', name: 'Polygon', price: 1.5, change: 3.4 }
  ];
  
  // Use API data or fallback if not available
  const assetsToDisplay = trendingAssets.length > 0 ? trendingAssets : fallbackAssets;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Market Overview</h2>
        <button 
          onClick={() => navigate('/account/trading')}
          className="text-primary-500 text-sm flex items-center hover:text-primary-400"
        >
          Go to Trading <FaArrowRight className="ml-1" size={12} />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
              <th className="pb-2">ASSET</th>
              <th className="pb-2">PRICE</th>
              <th className="pb-2">24H CHANGE</th>
              <th className="pb-2 text-right">TRADE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {assetsToDisplay.map((asset, index) => (
              <tr key={asset.symbol || index} className="text-sm">
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="p-1 mr-2">
                      {getCryptoIcon(asset.symbol)}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{asset.symbol}</p>
                      <p className="text-gray-400 text-xs">{asset.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span className="text-gray-200 font-medium">
                    ${typeof asset.price === 'number' 
                      ? asset.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) 
                      : asset.price}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    {asset.change >= 0 ? (
                      <>
                        <FaArrowUp className="text-green-500 mr-1" size={12} />
                        <span className="text-green-500">
                          {typeof asset.change === 'number' ? asset.change.toFixed(2) : asset.change}%
                        </span>
                      </>
                    ) : (
                      <>
                        <FaArrowDown className="text-red-500 mr-1" size={12} />
                        <span className="text-red-500">
                          {typeof asset.change === 'number' ? Math.abs(asset.change).toFixed(2) : Math.abs(parseFloat(asset.change)).toFixed(2)}%
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => navigate(`/account/trading?symbol=${asset.symbol}`)}
                    className="py-1 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-md"
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketOverview;
