import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Homepage from "./Homepage";
import HomePageSection2 from "./HomePageSection2";
import HomePageSection3 from "./HomePageSection3";
import HomePageSection4 from "./HomePageSection4";
import TradingPlan from "./TradingPlan";
import HomeFooter from "./HomeFooter";
import FloatingActionButton from "../FloatingActionButton";
import { Suspense } from "react";
import TradingViewChart from "./TradingViewChart";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const darkModeEnabled = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(darkModeEnabled);
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
    >
      <Header />
      <div className={isDarkMode ? "landing-dark" : "landing-light"}>
        <Homepage theme={isDarkMode ? "dark" : "light"} />
        <HomePageSection2 theme={isDarkMode ? "dark" : "light"} />
        <HomePageSection3 theme={isDarkMode ? "dark" : "light"} />
        <TradingPlan theme={isDarkMode ? "dark" : "light"} />
        <HomePageSection4 theme={isDarkMode ? "dark" : "light"} />
        <HomeFooter />
      </div>
      <Suspense fallback={<div className="chart-loading">Loading chart...</div>}>
        <TradingViewChart />
      </Suspense>
    </motion.div>
  );
};

export default Home;
