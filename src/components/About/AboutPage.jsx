import { useEffect } from "react";
import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import AboutSection1 from "./AboutSection1";
import AboutSection2 from "./AboutSection2";
import AboutSection3 from "./AboutSection3";
import AboutSection4 from "./AboutSection4";
import AboutSection5 from "./AboutSection5";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow">
        <AboutSection1 />
        <AboutSection2 />
        <AboutSection3 />
        <AboutSection4 />
        <AboutSection5 />
      </main>
      <HomeFooter />
    </div>
  );
};

export default AboutPage;