import { useEffect } from "react";
import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import AboutSection1 from "./AboutSection1";
import AboutSection2 from "./AboutSection2";
import AboutSection3 from "./AboutSection3";
import AboutSection4 from "./AboutSection4";
import AboutSection5 from "./AboutSection5";
import { useDarkMode } from "../../context/DarkModeContext";

const AboutPage = () => {
  const { darkMode } = useDarkMode();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us | Fidelity First Brokers";
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white"}`}
    >
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
