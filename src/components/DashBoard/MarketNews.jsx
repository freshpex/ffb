import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaSpinner, FaExternalLinkAlt, FaRegClock, FaRegNewspaper } from 'react-icons/fa';

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        
        const apiKey = import.meta.env.VITE_APP_CRYPTOCOMPARE_API_KEY;
        
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular',
          {
            headers: {
              'authorization': `Apikey ${apiKey}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.Response === 'Error') {
          throw new Error(data.Message);
        }
        
        // Map API response to our news format
        const formattedNews = data.Data.map(item => ({
          id: item.id,
          title: item.title,
          source: item.source_info.name,
          url: item.url,
          publishedAt: item.published_on * 1000,
          thumbnail: item.imageurl,
          summary: item.body.length > 150 ? item.body.substring(0, 150) + '...' : item.body
        })).slice(0, 4);
        
        setNews(formattedNews);
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
