import { useSelector } from 'react-redux';
import { 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown, 
  FaChartPie, 
  FaRegCalendarAlt 
} from 'react-icons/fa';
import { 
  selectFinancialHighlights,
  selectDashboardComponentStatus 
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';

const FinancialHighlights = () => {
  const financialData = useSelector(selectFinancialHighlights);
  const componentStatus = useSelector(state => 
    selectDashboardComponentStatus(state, 'financialHighlights')
  );

  // If the component is loading, show a skeleton loader
  if (componentStatus === 'loading') {
    return <CardLoader title="Financial Highlights" height="h-64" />;
  }

  // Calculate percentages for the balance distribution chart
  const totalAllocation = Object.values(financialData?.assetAllocation || {}).reduce((a, b) => a + b, 0);
  
  const getPercentage = (value) => {
    if (!totalAllocation) return 0;
    return ((value / totalAllocation) * 100).toFixed(1);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Financial Highlights</h2>
        <span className="text-xs text-gray-400">
          <FaRegCalendarAlt className="inline mr-1" />
          {financialData?.period || 'This Month'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Portfolio Performance */}
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <FaChartLine className="mr-2 text-blue-500" />
            Portfolio Performance
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Current Value</span>
                <span className="text-gray-200 font-medium">
                  ${financialData?.portfolioValue?.current.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">Previous Value</span>
                <span className="text-gray-200">
                  ${financialData?.portfolioValue?.previous.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="flex-grow h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      financialData?.portfolioPerformance?.changePercent >= 0
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(financialData?.portfolioPerformance?.changePercent || 0) * 5, 100)}%` 
                    }}
                  ></div>
                </div>
                <span className={`ml-2 text-xs font-medium ${
                  financialData?.portfolioPerformance?.changePercent >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {financialData?.portfolioPerformance?.changePercent >= 0 ? (
                    <FaArrowUp className="inline mr-1" />
                  ) : (
                    <FaArrowDown className="inline mr-1" />
                  )}
                  {Math.abs(financialData?.portfolioPerformance?.changePercent || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Asset Allocation */}
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <FaChartPie className="mr-2 text-purple-500" />
            Asset Allocation
          </h3>
          
          <div className="space-y-3">
            {financialData?.assetAllocation && Object.entries(financialData.assetAllocation).map(([asset, value]) => (
              <div key={asset}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 capitalize">{asset}</span>
                  <span className="text-gray-200">{getPercentage(value)}%</span>
                </div>
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      asset === 'stocks' ? 'bg-blue-500' :
                      asset === 'crypto' ? 'bg-purple-500' :
                      asset === 'forex' ? 'bg-green-500' :
                      asset === 'commodities' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${getPercentage(value)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHighlights;
