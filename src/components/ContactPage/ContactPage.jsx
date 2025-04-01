import { useEffect } from 'react';
import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import PageTransition from '../common/PageTransition';
import ContactSection1 from './ContactSection1';
import ContactSection2 from './ContactSection2';
import ContactSection3 from './ContactSection3';
import ContactSection4 from './ContactSection4';
import { useDarkMode } from "../../context/DarkModeContext";

const ContactPage = () => {
  const { darkMode } = useDarkMode();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact Us | Fidelity First Brokers';
  }, []);

  return (
    <PageTransition>
      <div className={darkMode ? "bg-gray-900" : "bg-white"}>
        <Header />
        <main className="contact-page">
          <ContactSection1 />
          <ContactSection2 />
          <ContactSection3 />
          <ContactSection4 />
        </main>
        <HomeFooter />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
