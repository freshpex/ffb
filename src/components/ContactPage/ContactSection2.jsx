import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaComment, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const ContactSection2 = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In a real app, you would send the form data to your backend
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to send your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-form-section" id="contact-form" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Contact Form</h2>
          <p>Fill out this form and we'll get back to you as soon as possible</p>
        </motion.div>
        
        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="info-item">
              <div className="icon">
                <FaEnvelope />
              </div>
              <div className="text">
                <h4>Email</h4>
                <p>support@fidelityfirstbrokers.com</p>
                <p>info@fidelityfirstbrokers.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon">
                <FaPhone />
              </div>
              <div className="text">
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri: 8am - 8pm EST</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon">
                <FaMapMarkerAlt />
              </div>
              <div className="text">
                <h4>Office</h4>
                <p>123 Finance Street</p>
                <p>New York, NY 10001</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="contact-form"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {success ? (
              <div className="form-success">
                <FaCheckCircle />
                <h3>Message Sent!</h3>
                <p>Thank you for contacting us. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Full Name" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email Address" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-wrapper">
                    <FaComment className="input-icon" />
                    <input 
                      type="text" 
                      name="subject" 
                      placeholder="Subject" 
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <textarea 
                    name="message" 
                    placeholder="Your Message" 
                    rows="5" 
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  ></textarea>
                </div>
                
                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? <><FaSpinner className="spinner" /> Sending...</> : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection2;