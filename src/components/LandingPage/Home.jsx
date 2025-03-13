import Header from "./Header"
import HomeFooter from "./HomeFooter"
import HomePageSection3 from "./HomePageSection3"
import HomePageSection4 from "./HomePageSection4"
import Homepage from "./Homepage"
import HomePageSection2 from "./HomepageSection2"
import TradingPlan from "./TradingPlan"
import TradingViewChart from "./TradingViewChart"
import { motion } from "framer-motion"
import { Suspense } from "react"

function Home() {
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
      <Homepage />
      <HomePageSection2 />
      <Suspense fallback={<div className="chart-loading">Loading chart...</div>}>
        <TradingViewChart />
      </Suspense>
      <HomePageSection3 />
      <TradingPlan />
      <HomePageSection4 />
      <HomeFooter />
    </motion.div>
  )
}

export default Home;
