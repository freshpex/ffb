import { useEffect } from "react";
import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import TradingPlan from "../LandingPage/TradingPlan";
import HomePageSection4 from "../LandingPage/HomePageSection4";
import PricingSection1 from "./PricingSection1";
import PageTransition from "../../components/common/PageTransition";
import { useDarkMode } from "../../context/DarkModeContext";
import "../../css/animations.css";

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
        <TradingPlan />
        <HomePageSection4 />
        <HomeFooter />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
