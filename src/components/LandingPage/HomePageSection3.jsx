import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaChartLine, FaLightbulb, FaChartBar, FaHandshake, FaShieldAlt, FaUserTie } from "react-icons/fa";

const HomePageSection3 = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  const features = [
    {
      id: 1,
      title: "Advanced Analytics",
      description: "Access real-time data analytics and market insights to make informed investment decisions.",
      icon: <FaChartLine />,
      color: "bg-blue-500/20",
      iconColor: "text-blue-500"
    },
    {
      id: 2,
      title: "Expert Guidance",
      description: "Get personalized advice from our team of experienced financial advisors and market experts.",
      icon: <FaLightbulb />,
      color: "bg-yellow-500/20",
      iconColor: "text-yellow-500"
    },
    {
      id: 3,
      title: "Portfolio Diversification",
      description: "Spread your investments across multiple assets to minimize risk and maximize returns.",
      icon: <FaChartBar />,
      color: "bg-green-500/20",
      iconColor: "text-green-500"
    },
    {
      id: 4,
      title: "Transparent Fees",
      description: "We believe in full transparency with no hidden fees or commissions on your investments.",
      icon: <FaHandshake />,
      color: "bg-purple-500/20",
      iconColor: "text-purple-500"
    },
    {
      id: 5,
      title: "Enhanced Security",
      description: "Advanced encryption and security protocols to keep your funds and personal data safe.",
      icon: <FaShieldAlt />,
      color: "bg-red-500/20",
      iconColor: "text-red-500"
    },
    {
      id: 6,
      title: "Dedicated Support",
      description: "Our customer service team is available 24/7 to assist you with any questions or concerns.",
      icon: <FaUserTie />,
      color: "bg-indigo-500/20",
      iconColor: "text-indigo-500"
    }
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
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Why Choose Fidelity First Brokers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            We combine cutting-edge technology with financial expertise to deliver an exceptional investment experience.
          </motion.p>
        </div>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-primary-500 transition-all duration-300"
            >
              <div className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-5`}>
                <span className={`${feature.iconColor} text-2xl`}>{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomePageSection3;