import { useState, useEffect, useRef } from "react";
import TradingViewWidget from "./TradingViewWidget";
import { TiThMenu } from "react-icons/ti";
import { MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Add scroll event listener to create sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add event listener to detect clicks outside of menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close menu if clicking on hamburger icon
      if (hamburgerRef.current && hamburgerRef.current.contains(event.target)) {
        return;
      }
      
      // Close menu if it's open and the click is outside the menu
      if (menu && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
        setToggle(false);
      }
    };

    // Add event listener when menu is open
    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  const handleMenuBtn = (e) => {
    e.stopPropagation();
    setToggle(!toggle);
    setMenu(!menu);
  };

  window.onscroll = () => {
    setMenu(false);
    setToggle(false);
  };

  const navigateTo = (url) => {
    navigate(url);
    // Close the menu when navigating
    setMenu(false);
    setToggle(false);
  };

  return (
    <>
      <header className={scrolled ? "header-scrolled" : ""} style={{ zIndex: 50 }}>
        <motion.div 
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link className="link" to={"/"}>
            <h1>FFB</h1>
            <p>Fidelity First Brokers</p>
          </Link>
        </motion.div>
        
        {/* Positioning the widget container with proper z-index */}
        <motion.div 
          className="widgetbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ position: "relative", zIndex: 5 }}
        >
          <TradingViewWidget />
        </motion.div>
        
        <motion.div 
          className="header__btn"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ position: "relative", zIndex: 20 }}
        >
          <Link
              to={`/login`}
              className="link"
              onClick={() => navigateTo(`/login`)}
            >
            <motion.button 
              className="login-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >            
                Login
            </motion.button>
          
          </Link>
          
          
          <Link
              to={`/signup`}
              className="link"
              onClick={() => navigateTo(`/signup`)}
            >
            <motion.button 
              className="signup-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                Sign Up
            </motion.button>
          </Link>
        </motion.div>
        
        {!menu && !toggle ? (
          <div ref={hamburgerRef} style={{ display: 'flex', alignItems: 'center' }}>
            <TiThMenu 
              id="menubtn" 
              size={65} // Increased size from 50 to 65
              onClick={handleMenuBtn} 
              style={{ 
                position: "relative", 
                zIndex: 50, 
                cursor: "pointer",
                fontSize: "40px" // Additional size enhancement
              }}
            />
          </div>
        ) : (
          <div ref={hamburgerRef} style={{ display: 'flex', alignItems: 'center' }}>
            <MdClose 
              id="menubtn" 
              size={65}
              onClick={handleMenuBtn} 
              style={{ 
                position: "relative", 
                zIndex: 50, 
                cursor: "pointer",
                fontSize: "40px"
              }}
            />
          </div>
        )}
      </header>
      
      <nav>
        <motion.ul 
          className="navlists"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {["Home", "About Us", "Services", "Pricing", "Contact Us"].map((item, index) => (
            <motion.li 
              key={index}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                to={
                  item === "Home" ? "/" : 
                  item === "About Us" ? "/about" :
                  item === "Contact Us" ? "/contact" :
                  `/${item.toLowerCase().replace(' ', '')}`
                } 
                className="link"
                onClick={() => navigateTo(
                  item === "Home" ? "/" : 
                  item === "About Us" ? "/about" :
                  item === "Contact Us" ? "/contact" :
                  `/${item.toLowerCase().replace(' ', '')}`
                )}
              >
                {item}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
      
      {/* mobile menu with ref for click outside detection */}
      {menu && (
        <motion.nav
          ref={menuRef}
          className={toggle && menu ? "mobile__menu active" : "mobile__menu"}
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ 
            type: "tween",
            duration: 0.2,
            ease: "easeOut"
          }}
        >
          <ul className="nav">
            {["Home", "About Us", "Services", "Pricing", "Contact Us"].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={
                    item === "Home" ? "/" : 
                    item === "About Us" ? "/about" :
                    item === "Contact Us" ? "/contact" :
                    `/${item.toLowerCase().replace(' ', '')}`
                  }
                  className="link"
                  onClick={() => navigateTo(
                    item === "Home" ? "/" : 
                    item === "About Us" ? "/about" :
                    item === "Contact Us" ? "/contact" :
                    `/${item.toLowerCase().replace(' ', '')}`
                  )}
                >
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
          
          <div className="mobilemenu-btn">
            <motion.button 
              className="login-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className="link"
                to={`/login`}
                onClick={() => navigateTo(`/login`)}
              >
                Login
              </Link>
            </motion.button>
            
            <motion.button 
              className="signup-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className="link"
                to={`/signup`}
                onClick={() => navigateTo(`/signup`)}
              >
                Sign Up
              </Link>
            </motion.button>
          </div>
        </motion.nav>
      )}
    </>
  );
};

export default Header;
