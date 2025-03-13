import Header from "../LandingPage/Header";
import HomeFooter from "../LandingPage/HomeFooter";
import ContactSection1 from "./ContactSection1";
import ContactSection2 from "./ContactSection2";
import ContactSection3 from "./ContactSection3";
import ContactSection4 from "./ContactSection4";
import PageTransition from "../common/PageTransition";
import "/src/css/contact.css";

const ContactPage = () => {
  return (
    <PageTransition>
      <Header />
      <ContactSection1 />
      <ContactSection2 />
      <ContactSection3 />
      <ContactSection4 />
      <HomeFooter />
    </PageTransition>
  );
};

export default ContactPage;
