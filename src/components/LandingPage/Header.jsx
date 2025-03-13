import { useState, useEffect } from "react";
import TradingViewWidget from "./TradingViewWidget";
import { TiThMenu } from "react-icons/ti";
import { MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [menu, setMenu] = useState (false);
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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

  const handleMenuBtn = () => {
    setToggle(!toggle);
    setMenu(!menu);
  };

  window.onscroll = () => {
    setMenu(false);
    setToggle(false);
  };

  const navigateTo = (url) => {
    console.log("clicked");
    navigate(url);
  };

  return (
    <>
      <header className={scrolled ? "header-scrolled" : ""}>
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
        
        <motion.div 
          className="widgetbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TradingViewWidget />
        </motion.div>
        
        <motion.div 
          className="header__btn"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button 
            className="login-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={`/login`}
              className="link"
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
              to={`/signup`}
              className="link"
              onClick={() => navigateTo(`/signup`)}
            >
              Sign Up
            </Link>
          </motion.button>
        </motion.div>
        
        {!menu && !toggle ? (
          <TiThMenu id="menubtn" size={50} onClick={handleMenuBtn} />
        ) : (
          <MdClose id="menubtn" size={50} onClick={handleMenuBtn} />
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
                  item === "About Us" ? "/components/About/AboutPage" :
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
      
      {/* mobile menu with improved animations */}
      {menu && (
        <motion.nav
          className={toggle && menu ? "mobile__menu active" : "mobile__menu"}
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <ul className="nav">
            {["Home", "About Us", "Services", "Pricing", "Contact Us"].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={
                    item === "Home" ? "/" : 
                    item === "About Us" ? "/components/About/AboutPage" :
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
