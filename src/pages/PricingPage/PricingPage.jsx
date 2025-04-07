import { useEffect } from "react";
import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import TradingPlan from "../LandingPage/TradingPlan";
import HomePageSection4 from "../LandingPage/HomePageSection4";
import PricingSection1 from "./PricingSection1";
import PageTransition from "../../components/common/PageTransition";
import { useDarkMode } from "../../context/DarkModeContext";

const PricingPage = () => {
  const { darkMode } = useDarkMode();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Pricing & Plans | Fidelity First Brokers";
  }, []);

  return (
    <PageTransition>
      <div className={darkMode ? "bg-gray-900" : "bg-white"}>
        <Header />
        <PricingSection1 />
        <h1 
          className={`text-center text-4xl md:text-5xl font-bold mt-12 mb-10 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          data-aos="fade-up"
        >
          AFFORDABLE PACKAGES
        </h1>
        <TradingPlan />
        <HomePageSection4 />
        <HomeFooter />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
