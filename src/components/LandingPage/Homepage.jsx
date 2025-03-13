import { GiCash } from "react-icons/gi";
import { BsCashCoin } from "react-icons/bs";
import { RiSecurePaymentFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Homepage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navigateTo = (url) => {
    console.log("clicked");
    navigate(url);
  };

  // Text animation variants
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const featureBoxVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  return (
    <>
      <section className="homepage__container">
        <motion.div 
          className="homepage__innerbox"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h1 variants={textVariant}>
            YOUR NEW <span className="gradient-text">FINANCIAL PICTURE</span> STARTS HERE. <span className="gradient-text"> FINANCIAL ADVISORY</span> THAT WORKS
          </motion.h1>
          
          <motion.div 
            className="homepage__btn"
            variants={textVariant}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                to={`/services`}
                className="link"
                onClick={() => navigateTo(`/services`)}
              >
                LEARN MORE
              </Link>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="primary-btn"
            >
              <Link
                to={`/signup`}
                className="link"
                onClick={() => navigateTo(`/signup`)}
              >
                OPEN AN ACCOUNT
              </Link>
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bottombox"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div 
            className="box"
            variants={featureBoxVariant}
            whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <BsCashCoin size={40} className="icon-animated" />
            <h3>EASY TO USE</h3>
            <p>Trade Fx and Bitcoin Mining all from one account.</p>
          </motion.div>
          
          <motion.div 
            className="box"
            variants={featureBoxVariant}
            whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <GiCash size={40} className="icon-animated" />
            <h3>LOW COMMISSIONS</h3>
            <p>Pay as low as 15% of profit upon withdrawal from managed accounts.</p>
          </motion.div>
          
          <motion.div 
            className="box"
            variants={featureBoxVariant}
            whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <RiSecurePaymentFill size={40} className="icon-animated" />
            <h3>INSTANT AND SECURE</h3>
            <p>All Money Order(Western Union, Money gram) and Bitcoin.</p>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Homepage;
