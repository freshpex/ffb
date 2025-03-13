import { GrSecure } from "react-icons/gr";
import { TbWorldCheck } from "react-icons/tb";
import { BsCashCoin } from "react-icons/bs";
import { MdMobileScreenShare, MdPayments, MdConnectWithoutContact } from "react-icons/md";

const HomePageSection3 = () => {
  const features = [
    { 
      icon: <GrSecure className="icon" size={40} />, 
      title: "STRONG SECURITY", 
      description: "Our website is under very reliable information protection" 
    },
    { 
      icon: <TbWorldCheck className="icon" size={40} />, 
      title: "REPRESENTATIVES WORLDWIDE", 
      description: "We Cooperate with hundreds of representatives in dozens of countries" 
    },
    { 
      icon: <BsCashCoin className="icon" size={40} />, 
      title: "INSTANT PAYOUT", 
      description: "When your balance reaches the threshold, you can use the function to make a withdrawal" 
    },
    { 
      icon: <MdMobileScreenShare className="icon" size={40} />, 
      title: "MOBILE APP", 
      description: "Our trading mobile app will soon be available in Play Store and Appstore" 
    },
    { 
      icon: <MdPayments className="icon" size={40} />, 
      title: "PROGRESSIVE WEEKLY INCOME", 
      description: "Your daily earnings depend solely on the size of your deposits" 
    },
    { 
      icon: <MdConnectWithoutContact className="icon" size={40} />, 
      title: "24/7 ONLINE SUPPORT", 
      description: "You can get a full-fledged consultation by contacting our customer support" 
    }
  ];

  return (
    <>
      <section className="homepagesection3">
        <h1 data-aos="fade-up" className="section-title">Our Features</h1>
        <div className="inner__box">
          {features.map((feature, index) => (
            <div 
              className="box" 
              key={index} 
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="icon-container">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePageSection3;