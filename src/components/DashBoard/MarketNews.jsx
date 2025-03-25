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
        
        // Mock data for developement then switch back to https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular
        const mockNews = [
          {
            id: 1,
            title: "Bitcoin Reaches New All-Time High Above $69,000",
            source: "Crypto Daily",
            url: "#",
            publishedAt: Date.now() - 3600000, // 1 hour ago
            thumbnail: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Yml0Y29pbnxlbnwwfHwwfHx8MA%3D%3D",
            summary: "Bitcoin has broken its previous all-time high, reaching $69,000 for the first time as institutional adoption continues to grow."
          },
          {
            id: 2,
            title: "Ethereum Upgrade Slashes Gas Fees by 90%",
            source: "Blockchain Insider",
            url: "#",
            publishedAt: Date.now() - 86400000, // 1 day ago
            thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoZXJldW18ZW58MHx8MHx8fDA%3D",
            summary: "The latest Ethereum network upgrade has resulted in dramatically lower transaction fees, addressing one of the main user complaints."
          },
          {
            id: 3,
            title: "Global Crypto Adoption Surpasses 500 Million Users",
            source: "Financial Times",
            url: "#",
            publishedAt: Date.now() - 259200000, // 3 days ago
            thumbnail: "https://images.unsplash.com/photo-1629289251913-72423bc3f091?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNyeXB0b3xlbnwwfHwwfHx8MA%3D%3D",
            summary: "A new study reveals that more than half a billion people worldwide now use cryptocurrency, with the fastest growth occurring in emerging markets."
          },
          {
            id: 4,
            title: "SEC Approves Multiple Spot Ethereum ETFs",
            source: "Market Watch",
            url: "#",
            publishedAt: Date.now() - 345600000, // 4 days ago
            thumbnail: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXRoZXJldW18ZW58MHx8MHx8fDA%3D",
            summary: "Following Bitcoin ETFs, the Securities and Exchange Commission has now approved multiple spot Ethereum ETFs, bringing more institutional investments to the crypto ecosystem."
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
  
  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <FaSpinner size={30} className="text-primary-500" />
        </motion.div>
        <p className="text-gray-300">Loading latest market news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaNewspaper className="mr-2 text-primary-500" /> Crypto Market News
          </h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <FaRegNewspaper className="text-4xl text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Couldn't load news</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FaNewspaper className="mr-2 text-primary-500" /> Crypto Market News
        </h2>
        <button className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          View All
        </button>
      </div>
      
      <div className="p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {news.map((item) => (
            <motion.div 
              key={item.id} 
              className="bg-gray-900 rounded-lg overflow-hidden flex flex-col h-full"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div 
                className="h-40 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
              >
                {!item.thumbnail && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                    <FaRegNewspaper className="text-4xl text-gray-500" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 bg-primary-500 px-3 py-1 text-white text-xs font-medium">
                  {item.source}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{item.summary}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
                  <div className="flex items-center">
                    <FaRegClock className="mr-1" /> {formatTimeAgo(item.publishedAt)}
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-primary-400 hover:text-primary-300"
                  >
                    Read More <FaExternalLinkAlt className="ml-1" />
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
