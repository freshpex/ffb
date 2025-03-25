import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const ContactSection4 = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="cta-section" ref={ref}>
      <div className="container">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Start Trading with Confidence</h2>
          <p>Join thousands of traders worldwide who trust our platform for their investment needs.</p>
          <div className="cta-buttons">
            <a href="/signup" className="btn btn-primary">Open Account</a>
            <a href="/demo" className="btn btn-outline">Try Demo Account</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection4;