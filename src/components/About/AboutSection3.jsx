import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

const AboutSection3 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  const timeline = [
    {
      year: "2011",
      title: "Company Founded",
      description: "Fidelity First Brokers was established with a vision to provide innovative investment solutions to global clients."
    },
    {
      year: "2013",
      title: "Expansion to Global Markets",
      description: "We expanded our operations to include major financial markets across Asia, Europe, and the Americas."
    },
    {
      year: "2015",
      title: "Introduction of Digital Platform",
      description: "Launched our state-of-the-art digital trading platform, enabling clients to trade from anywhere in the world."
    },
    {
      year: "2018",
      title: "Launch of Crypto Investment Services",
      description: "Pioneered cryptocurrency investment solutions, making digital assets accessible to our diverse client base."
    },
    {
      year: "2020",
      title: "AI-Powered Analytics",
      description: "Integrated advanced AI technologies to enhance market analysis and investment recommendations."
    },
    {
      year: "2023",
      title: "Recognition & Growth",
      description: "Recognized as one of the fastest-growing investment firms with over 25,000 active clients worldwide."
    }
  ];

  return (
    <section className={`py-20 px-4 ${darkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}
          >
            Our Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto text-lg`}
          >
            From our humble beginnings to becoming a global investment leader, our journey has been defined by innovation, resilience, and a relentless commitment to client success.
          </motion.p>
        </div>
        
        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} hidden md:block`}></div>
          
          {/* Timeline entries */}
          <div className="space-y-12 relative">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center`}
              >
                <div className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                } mb-6 md:mb-0`}>
                  <span className="text-primary-500 text-sm font-semibold uppercase tracking-wider">{item.year}</span>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1 mb-2`}>{item.title}</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.description}</p>
                </div>
                
                <div className={`md:hidden w-full h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} my-4`}></div>
                
                <div className={`w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center relative z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2`}>
                  <span className="font-bold text-white text-sm">{index + 1}</span>
                </div>
                
                <div className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'
                }`}>
                  {/* This div is intentionally left empty to maintain spacing for the timeline */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection3;
