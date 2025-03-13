import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaSpinner, FaExternalLinkAlt, FaRegClock, FaRegNewspaper } from 'react-icons/fa';

// This would typically use a news API like CryptoCompare or CryptoControl
// For demonstration we'll use mock data
const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock news data
        const mockNews = [
          {
            id: '1',
            title: 'Bitcoin Surges to New All-Time High as Institutional Adoption Continues',
            source: 'CoinDesk',
            url: 'https://www.coindesk.com',
            publishedAt: '2023-11-30T08:24:00Z',
            thumbnail: 'https://via.placeholder.com/100x70',
            summary: 'Bitcoin reached a new all-time high today as major financial institutions continue to embrace cryptocurrency assets.'
          },
          {
            id: '2',
            title: 'Ethereum 2.0 Upgrade on Track for Q2 2024 Completion',
            source: 'CryptoSlate',
            url: 'https://cryptoslate.com',
            publishedAt: '2023-11-29T14:15:00Z',
            thumbnail: 'https://via.placeholder.com/100x70',
            summary: 'Ethereum developers have confirmed that the transition to Proof of Stake is proceeding according to schedule.'
          },
          {
            id: '3',
            title: 'SEC Approves Spot Ethereum ETF Applications',
            source: 'Bloomberg',
            url: 'https://www.bloomberg.com',
            publishedAt: '2023-11-28T22:30:00Z',
            thumbnail: 'https://via.placeholder.com/100x70',
            summary: 'The Securities and Exchange Commission has given the green light to several spot Ethereum ETF applications.'
          },
          {
            id: '4',
            title: 'Major Bank Launches Cryptocurrency Custody Services for Institutional Clients',
            source: 'Forbes',
            url: 'https://www.forbes.com',
            publishedAt: '2023-11-27T16:45:00Z',
            thumbnail: 'https://via.placeholder.com/100x70',
            summary: 'One of the world\'s largest banks has announced a new custody solution for digital assets, marking another milestone in crypto adoption.'
          }
        ];
        
        setNews(mockNews);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load market news');
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="dashboard-card market-news-feed">
        <div className="card-header">
          <h2 className="card-title"><FaNewspaper /> Crypto Market News</h2>
        </div>
        <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ marginBottom: '15px' }}
          >
            <FaSpinner size={30} color="#f9a23f" />
          </motion.div>
          <p>Loading latest market news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card market-news-feed">
        <div className="card-header">
          <h2 className="card-title"><FaNewspaper /> Crypto Market News</h2>
        </div>
        <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="empty-state">
            <FaRegNewspaper className="empty-state-icon" />
            <h3>Couldn`t load news</h3>
            <p>{error}</p>
            <button className="form-btn" onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card market-news-feed">
      <div className="card-header">
        <h2 className="card-title"><FaNewspaper /> Crypto Market News</h2>
        <button className="view-all-btn">View All</button>
      </div>
      
      <div className="card-body">
        <motion.div 
          className="news-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {news.map((item) => (
            <motion.div 
              key={item.id} 
              className="news-card"
              variants={itemVariants}
            >
              <div 
                className="news-card-image" 
                style={{ backgroundImage: `url(${item.thumbnail})` }}
              >
                {!item.thumbnail && (
                  <div className="news-card-placeholder">
                    <FaRegNewspaper />
                  </div>
                )}
                <div className="news-card-source">{item.source}</div>
              </div>
              <div className="news-card-content">
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-card-summary">{item.summary}</p>
                <div className="news-card-footer">
                  <div className="news-card-date">
                    <FaRegClock /> {new Date(item.publishedAt).toLocaleDateString()}
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="news-card-link">
                    Read More <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarketNews;
