import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import TradingPlan from "../LandingPage/TradingPlan";
import HomePageSection4 from "../LandingPage/HomePageSection4";
import PricingSection1 from "./PricingSection1";
import PageTransition from "../common/PageTransition";
import "/src/css/pricing.css";

const PricingPage = () => {
  return (
    <PageTransition>
      <Header />
      <PricingSection1 />
      <h1 className="pricingh1" data-aos="fade-up">AFFORDABLE PACKAGES</h1>
      <TradingPlan />
      <HomePageSection4 />
      <HomeFooter />
    </PageTransition>
  );
};

export default PricingPage;
