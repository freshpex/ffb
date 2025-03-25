import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronUp, FaComments, FaTimes, FaAngleUp } from 'react-icons/fa';
import { MdLiveHelp } from 'react-icons/md';

const FloatingActionButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
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

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div 
            className="scroll-top-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
          >
            <FaAngleUp />
          </motion.div>
        )}
      </AnimatePresence>

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
          className={`floating-action-button ${showChat ? 'active' : ''}`}
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {showChat ? <FaTimes /> : <FaComments />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showChat && (
          <motion.div 
            className="chat-widget"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 400 }}
            exit={{ opacity: 0, y: 20, height: 0 }}
          >
            <div className="chat-header">
              <h3>Live Support</h3>
            </div>
            <div className="chat-body">
              <div className="chat-message support">
                <p>Hello! How can I help you today?</p>
                <span className="message-time">12:01 PM</span>
              </div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button className="send-button">Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActionButton;
