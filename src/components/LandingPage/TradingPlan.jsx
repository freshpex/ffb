import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TradingPlan = () => {
  const navigate = useNavigate();

  const navigateTo = (url) => {
    console.log("clicked");
    navigate(url);
  };

  const plans = [
    {
      title: "BITCOIN MINI PLAN 1",
      weeklyInterest: "10%",
      investmentSum: "$100",
      commission: "10%",
      referralBonus: "7%",
      price: "$500+",
      featured: false
    },
    {
      title: "BITCOIN MINI PLAN 2",
      weeklyInterest: "12%",
      investmentSum: "$10,000",
      commission: "15%",
      referralBonus: "8%",
      price: "$10,000+",
      featured: false
    },
    {
      title: "BITCOIN FX SILVER PLAN",
      weeklyInterest: "15%",
      investmentSum: "$20,000",
      commission: "15%",
      referralBonus: "10%",
      price: "$20,000+",
      featured: true
    },
    {
      title: "BITCOIN FX GOLD PLAN",
      weeklyInterest: "18%",
      investmentSum: "$30,000",
      commission: "20%",
      referralBonus: "10%",
      price: "$30,000+",
      featured: false
    },
    {
      title: "PLATINUM ELITE PLAN",
      weeklyInterest: "20%",
      investmentSum: "$40,000",
      commission: "20%",
      referralBonus: "10%",
      price: "$40,000+",
      featured: false
    },
    {
      title: "PLATINUM CORPORATE PLAN",
      weeklyInterest: "25%",
      investmentSum: "$50,000",
      commission: "25%",
      referralBonus: "10%",
      price: "$50,000+",
      featured: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto" data-aos="fade-up">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">SELECT A TRADING PLAN</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div 
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg border ${
                plan.featured ? 'border-primary-500 shadow-primary-500/20' : 'border-gray-700'
              } relative`}
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold py-1 px-3 transform translate-x-2 -translate-y-1/3 rotate-45">
                  Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className={`text-xl font-bold ${plan.featured ? 'text-primary-500' : 'text-white'} mb-4 text-center`}>
                  {plan.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Weekly Interest:</span>
                    <span className="text-white font-medium">{plan.weeklyInterest}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Investment Sum:</span>
                    <span className="text-white font-medium">{plan.investmentSum}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Trading/Withdrawal Commission:</span>
                    <span className="text-white font-medium">{plan.commission}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Referral Bonus:</span>
                    <span className="text-white font-medium">{plan.referralBonus}</span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center text-primary-500 mb-6">{plan.price}</h2>

                <Link
                  to="/signup"
                  onClick={() => navigateTo("/signup")}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-bold transition-colors duration-300 ${
                    plan.featured 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  APPLY NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradingPlan;
