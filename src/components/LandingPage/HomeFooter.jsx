import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const HomeFooter = () => {
  const navigate = useNavigate();

  const navigateTo = (url) => {
    console.log("clicked");
    navigate(url);
  };
  
  const footerLinkSections = [
    {
      title: "Navigation",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/components/About/AboutPage" },
        { name: "Services", path: "/services" },
        { name: "Pricing", path: "/pricing" },
        { name: "Contact Us", path: "/contact" },
      ]
    },
    {
      title: "Accounts",
      links: [
        { name: "FAQ", path: "/" },
        { name: "Login", path: "/login" },
        { name: "Sign Up", path: "/signup" },
        { name: "Learn More", path: "/services" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Legal information", path: "/" },
        { name: "Privacy Policy", path: "/" },
        { name: "Regulations", path: "/" },
        { name: "Risk Disclaimer", path: "/" },
      ]
    },
    {
      title: "Invest",
      links: [
        { name: "Forex", path: "/" },
        { name: "Commodities", path: "/" },
        { name: "Stocks", path: "/" },
        { name: "Cryptocurrencies", path: "/" },
        { name: "Cashback Rebates", path: "/" },
      ]
    },
    {
      title: "Earn",
      links: [
        { name: "Cash Plus", path: "/" },
        { name: "Staking", path: "/" },
        { name: "Best Stocks", path: "/" },
        { name: "Tell-a-Friend", path: "/" },
        { name: "Affiliate programme", path: "/" },
      ]
    }
  ];

  return (
    <footer>
      <div className="footer-top">
        <div className="container">
          <div className="footer-contact" data-aos="fade-up">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Contact Us
            </motion.h2>
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p><MdLocationOn size={20} /> Richmond Hill Road, Kingstown, St. Vincent</p>
              <p><MdPhone size={20} /> +44 28 2544 7780</p>
              <p><MdEmail size={20} /> support@ffbinvestment.net</p>
            </motion.div>
            <motion.div 
              className="social-links"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a href="#" className="social-icon"><FaFacebookF /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaLinkedinIn /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
            </motion.div>
          </div>
          
          <div className="inner__footer">
            <motion.div 
              className="box logo-box"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="logo">
                <Link className="link" to={"/"}>
                  <h1>FFB</h1>
                  <p>Fidelity First Brokers</p>
                </Link>
              </div>
              <p className="footer-description">
                Your trusted partner in financial investments. Access global markets with confidence and expert support.
              </p>
            </motion.div>

            {footerLinkSections.map((section, index) => (
              <motion.ul 
                className="box" 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <li className="footer-title">{section.title}</li>
                {section.links.map((link, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      to={link.path}
                      className="link"
                      onClick={() => navigateTo(link.path)}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            ))}
          </div>
        </div>
      </div>
      
      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p>&copy; FFB {new Date().getFullYear()} || All rights reserved</p>
        <p className="footer-disclaimer">
          This website is operated by FP Markets LLC. FP Markets LLC is a company registered with FSA of St. Vincent and the Grenadines, with registration number 126 LLC 2019 and registered address at Richmond Hill Road, Kingstown, VC0100, St. Vincent and the Grenadines.
        </p>
        <p className="footer-risk">
          Risk Warning: Derivative products are highly leveraged, carry a high level of risk and may not be appropriate for all investors. Please consider our legal documents before investing.
        </p>
      </motion.div>
    </footer>
  );
};

export default HomeFooter;
