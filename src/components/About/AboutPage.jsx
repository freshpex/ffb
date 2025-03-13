import Header from "../LandingPage/Header"
import AboutSection1 from "./AboutSection1"
import AboutSection2 from "./AboutSection2"
import AboutSection3 from "./AboutSection3"
import AboutSection4 from "./AboutSection4"
import AboutSection5 from "./AboutSection5"
import HomeFooter from "../LandingPage/HomeFooter"
import PageTransition from "../common/PageTransition"
import "/src/css/about.css";

const AboutPage = () => {
  return (
    <PageTransition>
      <Header />
      <AboutSection1 />
      <AboutSection2 />
      <AboutSection3 />
      <AboutSection4 />
      <AboutSection5 />
      <HomeFooter />
    </PageTransition>
  )
}

export default AboutPage