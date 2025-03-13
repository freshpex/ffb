import { motion } from "framer-motion";

const ContactSection4 = () => {
  return (
    <>
      <section className="contactsection4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="map-container"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Locate Us on Google Maps
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            St. Vincent and the Grenadines
          </motion.p>
          
          <motion.div 
            className="map-frame"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d7770.250899962601!2d-61.219329!3d13.154486!3m2!1i1024!2i768!4f13.1!2m1!1sRichmond%20Hill%20Rd%20Kingstown%20St%20Vincent%20and%20the%20Grenadines!5e0!3m2!1sen!2sus!4v1700921918833!5m2!1sen!2sus" 
              width="100%" 
              height="500" 
              style={{border: 0 }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}

export default ContactSection4;