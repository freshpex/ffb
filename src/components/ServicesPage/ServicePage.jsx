import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import ServiceSection1 from "./ServiceSection1";
import ServiceSection2 from "./ServiceSection2";
import PageTransition from "../common/PageTransition";
import "../../css/services.css";

const ServicePage = () => {
  return (
    <PageTransition>
      <Header />
      <ServiceSection1 />
      <ServiceSection2 />
      <HomeFooter />
    </PageTransition>
  );
};

export default ServicePage;
