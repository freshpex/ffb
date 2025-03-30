import { useSelector } from 'react-redux';
import { 
  FaGlobeAmericas, 
  FaChartLine, 
  FaRegSmile, 
  FaRegMeh, 
  FaRegFrown 
} from 'react-icons/fa';
import { 
  selectMarketPulse,
  selectDashboardComponentStatus 
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';

const MarketPulse = () => {
  const marketPulse = useSelector(selectMarketPulse);
  const componentStatus = useSelector(state => 
    selectDashboardComponentStatus(state, 'marketPulse')
  );
  
  // If the component is loading, show a skeleton loader
  if (componentStatus === 'loading') {
    return <CardLoader title="Market Pulse" height="h-48" />;
  }
  
  // Helper to get sentiment icon and color
  const getSentimentDisplay = (sentiment) => {
    if (!sentiment) return { icon: <FaRegMeh />, color: 'text-gray-400' };
    
    const sentimentValue = parseFloat(sentiment);
    
    if (sentimentValue >= 70) {
      return { icon: <FaRegSmile />, color: 'text-green-500' };
    } else if (sentimentValue <= 30) {
      return { icon: <FaRegFrown />, color: 'text-red-500' };
    } else {
      return { icon: <FaRegMeh />, color: 'text-yellow-500' };
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Market Pulse</h2>
        <span className="text-xs text-gray-400">Live data</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {marketPulse?.indices?.map((index) => (
          <div key={index.symbol} className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="text-gray-300 font-medium">{index.name}</span>
              <div className={index.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {index.change >= 0 ? '+' : ''}{index.change}%
              </div>
            </div>
            <div className="text-gray-400 text-sm">{index.region}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 bg-gray-700/30 rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
          <FaGlobeAmericas className="mr-2 text-blue-500" /> Market Sentiment
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {marketPulse?.sentiment && Object.entries(marketPulse.sentiment).map(([market, value]) => {
            const { icon, color } = getSentimentDisplay(value);
            
            return (
              <div key={market} className="text-center">
                <p className="text-xs text-gray-400 capitalize mb-1">{market}</p>
                <div className={`text-xl ${color}`}>
                  {icon}
                </div>
                <p className="text-sm font-medium mt-1 text-gray-300">{value}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
