import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaChartLine, FaMoneyBillWave, FaChartPie, FaRegClock } from "react-icons/fa";

const HomePageSection2 = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
  
  const investmentOptions = [
    {
      id: 1,
      title: "Starter Plan",
      minInvestment: "500",
      return: "5-8%",
      duration: "7 days",
      icon: <FaMoneyBillWave />,
      color: "from-blue-600 to-blue-400"
    },
    {
      id: 2,
      title: "Premium Plan",
      minInvestment: "5,000",
      return: "10-15%",
      duration: "30 days",
      icon: <FaChartLine />,
      color: "from-green-600 to-green-400",
      featured: true
    },
    {
      id: 3,
      title: "Expert Plan",
      minInvestment: "25,000",
      return: "18-25%",
      duration: "90 days",
      icon: <FaChartPie />,
      color: "from-purple-600 to-purple-400"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-900/80 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Investment Plans for Every Investor
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Choose from our diverse range of investment options designed to meet your financial goals and risk tolerance.
          </motion.p>
        </div>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {investmentOptions.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className={`rounded-xl p-6 ${
                plan.featured
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-primary-500 shadow-lg shadow-primary-500/20 transform -translate-y-4 md:translate-y-0 md:scale-110 z-10"
                  : "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
              } transition-all duration-300 hover:shadow-lg relative`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                  <div className="bg-primary-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-md">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-full mb-6 bg-gradient-to-r ${plan.color} flex items-center justify-center text-white text-2xl`}>
                {plan.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{plan.title}</h3>
              
              <div className="mb-6">
                <p className="text-gray-400 mb-2 flex justify-between">
                  <span>Minimum Investment:</span>
                  <span className="text-white font-semibold">${plan.minInvestment}</span>
                </p>
                <p className="text-gray-400 mb-2 flex justify-between">
                  <span>Expected Return:</span>
                  <span className="text-primary-500 font-semibold">{plan.return}</span>
                </p>
                <p className="text-gray-400 flex justify-between">
                  <span>Duration:</span>
                  <span className="text-white font-semibold flex items-center">
                    <FaRegClock className="mr-1 text-primary-500" />
                    {plan.duration}
                  </span>
                </p>
              </div>
              
              <button className={`w-full py-3 rounded-lg text-white font-semibold ${
                plan.featured
                  ? "bg-primary-600 hover:bg-primary-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } transition-colors duration-300`}>
                Start Investing
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomePageSection2;
