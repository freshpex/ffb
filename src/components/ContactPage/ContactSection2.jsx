import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { FaBusinessTime, FaMailBulk } from "react-icons/fa";
import { SiTimescale } from "react-icons/si";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ContactSection2 = () => {
  const contactOptions = [
    {
      icon: <HiOutlineOfficeBuilding className="icon" size={60} />,
      title: "Office",
      content: [
        "St. Vincent and the Grenadines",
        "Richmond Hill Road, Kingstown, VC0100, St. Vincent and the Grenadines.",
        "Email: supportteam@fpmarkets.com"
      ]
    },
    {
      icon: <RiCustomerService2Fill className="icon" size={60} />,
      title: "Phone Numbers",
      content: [
        "St. Vincent and the Grenadines",
        "General: +44 28 2544 7780"
      ]
    },
    {
      icon: <MdSupportAgent className="icon" size={60} />,
      title: "Toll Free Numbers",
      content: [
        "General",
        "+44 28 2544 7780"
      ],
      button: "All free numbers"
    },
    {
      icon: <FaBusinessTime className="icon" size={60} />,
      title: "Company Registrations",
      content: [
        "126 LLC 2019"
      ]
    },
    {
      icon: <FaMailBulk className="icon" size={60} />,
      title: "Email Enquires",
      content: [
        "New enquiries:",
        "supportteam@fpmarkets.com"
      ]
    },
    {
      icon: <SiTimescale className="icon" size={60} />,
      title: "Office Hours",
      content: [
        "Monday – Saturday (AEDT)",
        "07:00 – 07:00",
        "Sunday – Friday (GMT)",
        "22:00 – 22:00"
      ]
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  return (
    <>
      <section className="contactsection2" ref={ref}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          CONTACT OPTIONS
        </motion.h1>
        
        <div className="innerbox">
          {contactOptions.map((option, index) => (
            <motion.div
              className="box"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <motion.div
                className="icon-container"
                whileHover={{ rotate: 10 }}
              >
                {option.icon}
              </motion.div>
              <h4>{option.title}</h4>
              {option.content.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {option.button && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{option.button}</motion.button>}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}

export default ContactSection2;