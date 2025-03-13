import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

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
    <>
      <section className="tradingplansection" data-aos="fade-up">
        <h1>SELECT A TRADING PLAN</h1>
        <div className="innerbox">
          {plans.map((plan, index) => (
            <div 
              className={`box ${plan.featured ? 'featured-plan' : ''}`} 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {plan.featured && <div className="ribbon">Popular</div>}
              <h3>{plan.title}</h3>
              <div className="plan-details">
                <div className="plan-feature">
                  <span className="feature-label">Weekly Interest:</span>
                  <span className="feature-value">{plan.weeklyInterest}</span>
                </div>
                <div className="plan-feature">
                  <span className="feature-label">Investment Sum:</span>
                  <span className="feature-value">{plan.investmentSum}</span>
                </div>
                <div className="plan-feature">
                  <span className="feature-label">Trading/Withdrawal Commission:</span>
                  <span className="feature-value">{plan.commission}</span>
                </div>
                <div className="plan-feature">
                  <span className="feature-label">Referral Bonus:</span>
                  <span className="feature-value">{plan.referralBonus}</span>
                </div>
              </div>

              <h2 className="price">{plan.price}</h2>

              <button className={`plan-button ${plan.featured ? 'featured-button' : ''}`}>
                <Link
                  to={`/signup`}
                  className="link"
                  onClick={() => navigateTo(`/signup`)}
                >
                  APPLY NOW
                </Link>
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TradingPlan;
