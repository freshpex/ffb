import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import PageTransition from '../common/PageTransition';
import ContactSection1 from './ContactSection1';
import ContactSection2 from './ContactSection2';
import ContactSection3 from './ContactSection3';
import ContactSection4 from './ContactSection4';
import '../../css/contact.css';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact Us | Fidelity First Brokers';
  }, []);

  return (
    <PageTransition>
      <Header />
      <main className="contact-page">
        <ContactSection1 />
        <ContactSection2 />
        <ContactSection3 />
        <ContactSection4 />
      </main>
      <HomeFooter />
    </PageTransition>
  );
};

export default ContactPage;
