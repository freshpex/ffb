import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { FaQuoteLeft, FaStar, FaArrowRight } from "react-icons/fa";

const HomePageSection4 = () => {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.4 });
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Retail Investor",
      image: "/images/testimonial-1.jpg",
      content: "Investing with Fidelity First Brokers has been a game-changer for my financial future. The platform is intuitive, and the returns have consistently exceeded my expectations.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Entrepreneur",
      image: "/images/testimonial-2.jpg",
      content: "The expert guidance and diverse investment options provided by FFB have helped me grow my capital significantly while managing risk effectively.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Financial Analyst",
      image: "/images/testimonial-3.jpg",
      content: "As someone who works in finance, I appreciate the transparency and professional approach of Fidelity First. Their premium plan has delivered excellent returns for my portfolio.",
      rating: 4
    }
  ];
  
  const stats = [
    { id: 1, value: "25k+", label: "Active Investors" },
    { id: 2, value: "$150M+", label: "Assets Managed" },
    { id: 3, value: "12+", label: "Years Experience" },
    { id: 4, value: "97%", label: "Client Satisfaction" }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        {/* Testimonials */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Don't just take our word for it. Hear from some of our satisfied investors around the world.
          </motion.p>
        </div>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
            >
              <div className="mb-6 text-primary-500">
                <FaQuoteLeft size={24} />
              </div>
              
              <p className="text-gray-300 mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden mr-3">
                    <img 
                      src={testimonial.image || `https://ui-avatars.com/api/?name=${testimonial.name}&background=0D8ABC&color=fff`} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=0D8ABC&color=fff`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < testimonial.rating ? "text-yellow-500" : "text-gray-600"} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/60 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-700 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <motion.h3
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 * stat.id }}
                  className="text-3xl md:text-4xl font-bold text-primary-500 mb-2"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isStatsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Start Your Investment Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isStatsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-400 max-w-2xl mx-auto mb-8"
          >
            Join thousands of investors who trust Fidelity First Brokers with their financial goals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 inline-flex items-center"
            >
              Create Free Account <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomePageSection4;