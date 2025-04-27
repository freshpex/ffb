import { useSelector } from "react-redux";
import {
  FaGlobeAmericas,
  FaChartLine,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown,
} from "react-icons/fa";
import {
  selectMarketPulse,
  selectDashboardComponentStatus,
} from "../../redux/slices/dashboardSlice";
import CardLoader from "../common/CardLoader";

const MarketPulse = () => {
  const marketPulse = useSelector(selectMarketPulse);
  const componentStatus = useSelector((state) =>
    selectDashboardComponentStatus(state, "marketPulse"),
  );

  if (componentStatus === "loading") {
    return <CardLoader title="Market Pulse" height="h-48" />;
  }

  // Helper to get icon and color for numeric sentiment scores
  const getSentimentDisplay = (score) => {
    const sentimentValue = parseFloat(score);
    if (isNaN(sentimentValue))
      return { icon: <FaRegMeh />, color: "text-gray-400" };
    if (sentimentValue >= 70) {
      return { icon: <FaRegSmile />, color: "text-green-500" };
    } else if (sentimentValue <= 30) {
      return { icon: <FaRegFrown />, color: "text-red-500" };
    } else {
      return { icon: <FaRegMeh />, color: "text-yellow-500" };
    }
  };

  // Helper for trend sentiment display
  const getTrendDisplay = (sentiment) => {
    if (!sentiment) return { icon: <FaRegMeh />, color: "text-gray-400" };
    if (sentiment.toLowerCase() === "bullish") {
      return { icon: <FaRegSmile />, color: "text-green-500" };
    } else if (sentiment.toLowerCase() === "bearish") {
      return { icon: <FaRegFrown />, color: "text-red-500" };
    } else {
      return { icon: <FaRegMeh />, color: "text-yellow-500" };
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-100">Market Pulse</h2>
        <span className="text-sm text-gray-400">Live Data</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market Cap */}
        {marketPulse?.marketCap && (
          <div className="bg-gray-700/30 rounded-lg p-4 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-300 flex items-center mb-2">
              <FaChartLine className="mr-2 text-blue-400" />
              Market Cap
            </h3>
            <p className="text-2xl font-semibold text-gray-100">
              {marketPulse.marketCap.total}B
            </p>
            <p
              className={`mt-1 text-sm ${marketPulse.marketCap.change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {marketPulse.marketCap.change >= 0 ? "+" : ""}
              {marketPulse.marketCap.change}%
            </p>
          </div>
        )}

        {/* Volatility Index */}
        {marketPulse?.volatilityIndex !== undefined && (
          <div className="bg-gray-700/30 rounded-lg p-4 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-300 flex items-center mb-2">
              <FaChartLine className="mr-2 text-blue-400" />
              Volatility Index
            </h3>
            <p className="text-2xl font-semibold text-gray-100">
              {marketPulse.volatilityIndex}
            </p>
          </div>
        )}

        {/* Overall Sentiment */}
        {marketPulse?.sentiment && (
          <div className="bg-gray-700/30 rounded-lg p-4 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-300 flex items-center mb-2">
              <FaGlobeAmericas className="mr-2 text-blue-400" />
              Overall Sentiment
            </h3>
            <div className="flex items-center justify-center">
              {(() => {
                const { icon, color } = getSentimentDisplay(
                  marketPulse.sentiment.score,
                );
                return <div className={`text-3xl ${color}`}>{icon}</div>;
              })()}
            </div>
            <p className="mt-2 text-center text-gray-100 font-medium capitalize">
              {marketPulse.sentiment.overall} ({marketPulse.sentiment.score}%)
            </p>
          </div>
        )}
      </div>

      {/* Trends Section */}
      {marketPulse?.trends && marketPulse.trends.length > 0 && (
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <FaGlobeAmericas className="mr-2 text-blue-400" /> Trends by Sector
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {marketPulse.trends.map((trend, index) => {
              const { icon, color } = getTrendDisplay(trend.sentiment);
              return (
                <div key={index} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-300 font-medium">{trend.sector}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className={`text-xl ${color}`}>{icon}</div>
                    <p className="text-sm text-gray-100 font-medium">
                      Strength: {trend.strength}%
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-400 capitalize">
                    {trend.sentiment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPulse;
