import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import picture from "/src/assets/images/shubham-dhage-T9rKvI3N0NM-unsplash.jpg";

const HomePageSection2 = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <>
      <motion.section 
        className="homepagesection2"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div 
          className="box1" 
          variants={itemVariants}
        >
          <div className="img__box">
            <motion.img
              src={picture}
              alt="image2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="box2"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants}>WE OFFER SAFE AND SECURE INVESTMENTS</motion.h1>
          <motion.p variants={itemVariants}>
            We offer Clients premium tehcnical analysis and research products
            developed by a leading team of financial and economic experts. With
            over 30 years of combined and industry experience, our analysts
            produce high quality technical analysis and macroeconomic reports
            available to clients on daily basis.
          </motion.p>
          
          <motion.ul variants={containerVariants}>
            <motion.li variants={itemVariants} whileHover={{ x: 5 }}>POWERFUL SYSTEM</motion.li>
            <motion.li variants={itemVariants} whileHover={{ x: 5 }}>EXPERT MANAGERS</motion.li>
            <motion.li variants={itemVariants} whileHover={{ x: 5 }}>24/7 SERVICES</motion.li>
          </motion.ul>
          
          <motion.p variants={itemVariants}>
            Our primary goal is to provide our customers with an exclusive platform to interact with their investments. Our winning Auto Trader trading platform has been developed for beginners and professionals alike.
          </motion.p>
          
          <motion.button 
            variants={itemVariants} 
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Read More
          </motion.button>
        </motion.div>
      </motion.section>
    </>
  );
};

export default HomePageSection2;
