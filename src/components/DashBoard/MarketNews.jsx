import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaNewspaper, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { 
  selectMarketNews,
  selectDashboardComponentStatus 
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';
import { formatDistanceToNow } from 'date-fns';

const MarketNews = ({ maxItems }) => {
  const navigate = useNavigate();
  const newsItems = useSelector(selectMarketNews);
  const componentStatus = useSelector(state => 
    selectDashboardComponentStatus(state, 'marketNews')
  );
  
  // If the component is loading, show a skeleton loader
  if (componentStatus === 'loading') {
    return <CardLoader title="Market News" height="h-80" />;
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Market News</h2>
        <button 
          onClick={() => navigate('/login/market-news')}
          className="text-primary-500 text-sm flex items-center hover:text-primary-400"
        >
          View All <FaArrowRight className="ml-1" size={12} />
        </button>
      </div>
      
      <div className="space-y-4">
        {newsItems && newsItems.length > 0 ? (
          newsItems.slice(0, maxItems).map((news) => (
            <div key={news.id} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-gray-200 font-medium mb-1 line-clamp-2">
                {news.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                {news.snippet}
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">
                  {formatDistanceToNow(new Date(news.date), { addSuffix: true })} · {news.source}
                </span>
                <a 
                  href={news.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-400 flex items-center"
                >
                  Read more <FaExternalLinkAlt className="ml-1" size={10} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <FaNewspaper className="mx-auto text-gray-500 mb-2" size={24} />
            <p className="text-gray-400">No news articles available</p>
          </div>
        )}
      </div>
    </div>
  );
};

MarketNews.propTypes = {
  maxItems: PropTypes.number
};

MarketNews.defaultProps = {
  maxItems: 3
};

export default MarketNews;
