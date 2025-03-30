import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaBitcoin, 
  FaEthereum, 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt, 
  FaArrowRight 
} from 'react-icons/fa';
import { 
  selectMarketPrices,
  selectDashboardComponentStatus 
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';

const MarketOverview = () => {
  const navigate = useNavigate();
  const prices = useSelector(selectMarketPrices);
  const componentStatus = useSelector(state => 
    selectDashboardComponentStatus(state, 'marketOverview')
  );
  
  // Helper to get crypto icon
  const getCryptoIcon = (symbol) => {
    switch (symbol) {
      case 'BTC':
        return <FaBitcoin className="text-orange-500" size={20} />;
      case 'ETH':
        return <FaEthereum className="text-blue-400" size={20} />;
      default:
        return <FaExchangeAlt className="text-gray-400" size={20} />;
    }
  };
  
  // If the component is loading, show a skeleton loader
  if (componentStatus === 'loading') {
    return <CardLoader title="Market Overview" height="h-72" />;
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Market Overview</h2>
        <button 
          onClick={() => navigate('/login/trading')}
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
            {prices && Object.entries(prices).map(([symbol, data]) => (
              <tr key={symbol} className="text-sm">
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="p-1 mr-2">
                      {getCryptoIcon(symbol)}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{symbol}</p>
                      <p className="text-gray-400 text-xs">
                        {symbol === 'BTC' ? 'Bitcoin' : 
                         symbol === 'ETH' ? 'Ethereum' : 
                         symbol === 'LTC' ? 'Litecoin' : 
                         symbol === 'XRP' ? 'Ripple' : symbol}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span className="text-gray-200 font-medium">
                    ${data.price.toLocaleString()}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    {data.change >= 0 ? (
                      <>
                        <FaArrowUp className="text-green-500 mr-1" size={12} />
                        <span className="text-green-500">{data.change.toFixed(2)}%</span>
                      </>
                    ) : (
                      <>
                        <FaArrowDown className="text-red-500 mr-1" size={12} />
                        <span className="text-red-500">{Math.abs(data.change).toFixed(2)}%</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => navigate(`/login/trading?symbol=${symbol}`)}
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
