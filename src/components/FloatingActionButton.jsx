import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronUp, FaComments, FaTimes } from 'react-icons/fa';
import { MdLiveHelp } from 'react-icons/md';

const FloatingActionButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="floating-action-container">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              className="fab scroll-top-btn"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronUp />
            </motion.button>
          )}
        </AnimatePresence>
        
        <motion.button
          className="fab chat-btn"
          onClick={() => setShowChat(!showChat)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showChat ? <FaTimes /> : <FaComments />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showChat && (
          <motion.div 
            className="chat-box"
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="chat-header">
              <MdLiveHelp size={24} />
              <h3>Live Support</h3>
              <motion.button 
                className="close-chat" 
                onClick={() => setShowChat(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>
            <div className="chat-body">
              <div className="message system-message">
                <p>Welcome to FFB Support! How can we help you today?</p>
                <span className="message-time">Just now</span>
              </div>
              <div className="chat-input-area">
                <input type="text" placeholder="Type your message here..." />
                <button>Send</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActionButton;
