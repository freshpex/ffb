import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const ContactSection1 = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="contact-hero" ref={ref}>
      <motion.div 
        className="contact-hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Get in Touch</h1>
        <p>We're here to help with any questions you might have about our services, platform, or investment opportunities.</p>
        <div className="contact-hero-cta">
          <a href="#contact-form" className="btn btn-primary">Contact Us</a>
          <a href="#faq" className="btn btn-outline">View FAQs</a>
        </div>
      </motion.div>
      
      <motion.div 
        className="contact-hero-image"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <img src="/src/assets/images/contact-hero.svg" alt="Customer Support" />
      </motion.div>
    </section>
  );
};

export default ContactSection1;
