import { useEffect } from "react";
import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import ServiceSection1 from "./ServiceSection1";
import ServiceSection2 from "./ServiceSection2";
import PageTransition from "../../components/common/PageTransition";
import { useDarkMode } from "../../context/DarkModeContext";

const ServicePage = () => {
  const { darkMode } = useDarkMode();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Our Services | Fidelity First Brokers";
  }, []);

  return (
    <PageTransition>
      <div className={darkMode ? "bg-gray-900" : "bg-white"}>
        <Header />
        <ServiceSection1 />
        <ServiceSection2 />
        <HomeFooter />
      </div>
    </PageTransition>
  );
};

export default ServicePage;
