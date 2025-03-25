import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FaLightbulb, FaLock, FaUserFriends, FaMoneyBillWave } from 'react-icons/fa';

const ContactSection3 = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I open a trading account?',
      answer: 'Opening an account is simple. Click the "Sign Up" button, fill in your details, verify your email, and complete our KYC process. Once approved, you can deposit funds and start trading.',
      icon: <FaUserFriends />
    },
    {
      id: 2,
      question: 'Is my personal and financial information secure?',
      answer: 'Yes, we use enterprise-grade security measures including encryption and secure data storage. We also employ strict verification protocols and regular security audits to protect your information.',
      icon: <FaLock />
    },
    {
      id: 3,
      question: 'What are the minimum deposit requirements?',
      answer: 'Our standard accounts have a minimum deposit of $100. Premium accounts require $10,000, and VIP accounts start at $50,000. Different investment plans may have their own minimums.',
      icon: <FaMoneyBillWave />
    },
    {
      id: 4,
      question: 'How can I learn more about trading?',
      answer: 'We offer extensive educational resources including webinars, tutorials, market analysis, and one-on-one coaching sessions with experienced traders. Visit our Learning Center for more information.',
      icon: <FaLightbulb />
    }
  ];

  return (
    <section className="faq-section" id="faq" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Frequently Asked Questions</h2>
          <p>Find quick answers to common questions about our services</p>
        </motion.div>
        
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <motion.div 
              key={faq.id}
              className="faq-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="faq-icon">
                {faq.icon}
              </div>
              <div className="faq-content">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="more-questions"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p>Still have questions? Check our <a href="/help-center">Help Center</a> or contact our support team.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection3;
