import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaUserTie, FaUniversity, FaChartBar, FaGlobe } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const AboutSection4 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const teamMembers = [
    {
      name: "Michael Wilson",
      position: "Chief Executive Officer",
      bio: "With over 20 years of experience in the financial sector, Michael has led Fidelity First Brokers to become a global leader in investment services.",
      image: "/src/assets/images/team/ceo.jpg",
    },
    {
      name: "Sarah Johnson",
      position: "Chief Investment Officer",
      bio: "Sarah's expertise in portfolio management and market analysis has been instrumental in delivering consistent returns for our clients.",
      image: "/src/assets/images/team/cio.jpg",
    },
    {
      name: "David Chen",
      position: "Chief Technology Officer",
      bio: "David has pioneered the integration of AI and blockchain technologies into our trading platforms, enhancing security and performance.",
      image: "/src/assets/images/team/cto.jpg",
    },
    {
      name: "Emily Rodriguez",
      position: "Head of Client Relations",
      bio: "Emily's dedication to client satisfaction has established our reputation for exceptional service and personalized investment solutions.",
      image: "/src/assets/images/team/client-relations.jpg",
    },
  ];

  const partners = [
    {
      name: "Global Financial Exchange",
      logo: "/src/assets/images/partners/gfe.png",
      icon: <FaGlobe />,
    },
    {
      name: "Investment Banking Institute",
      logo: "/src/assets/images/partners/ibi.png",
      icon: <FaUniversity />,
    },
    {
      name: "Market Analysis Group",
      logo: "/src/assets/images/partners/mag.png",
      icon: <FaChartBar />,
    },
    {
      name: "International Traders Association",
      logo: "/src/assets/images/partners/ita.png",
      icon: <FaUserTie />,
    },
  ];

  return (
    <section
      className={`py-20 px-4 ${darkMode ? "bg-gray-900/80" : "bg-gray-100"} overflow-hidden`}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Leadership Team */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
            >
              Our Leadership Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-3xl mx-auto text-lg`}
            >
              Meet the experienced professionals who guide our company's vision
              and ensure we deliver exceptional value to our clients.
            </motion.p>
          </div>

          <div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${
                  darkMode
                    ? "bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500"
                    : "bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-primary-500 shadow-lg"
                } transition-all duration-300`}
              >
                <div
                  className={`h-60 ${darkMode ? "bg-gray-700" : "bg-gray-200"} relative`}
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${member.name.replace(" ", "+")}&background=0D8ABC&color=fff&size=200`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-900/30">
                      <span className="text-5xl font-bold text-primary-500">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3
                    className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}
                  >
                    {member.name}
                  </h3>
                  <p className="text-primary-500 text-sm mb-4">
                    {member.position}
                  </p>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partners and Affiliations */}
        <div>
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
            >
              Our Partners & Affiliations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-3xl mx-auto text-lg`}
            >
              We collaborate with leading institutions to provide our clients
              with the best financial services and opportunities.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${
                  darkMode
                    ? "bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-primary-500"
                    : "bg-white backdrop-blur-sm border border-gray-200 hover:border-primary-500 shadow-lg"
                } p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center`}
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 mb-4 opacity-80"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className={`w-16 h-16 rounded-full ${darkMode ? "bg-primary-900/30" : "bg-primary-100"} flex items-center justify-center text-primary-500 text-2xl mb-4 ${partner.logo ? "hidden" : ""}`}
                >
                  {partner.icon}
                </div>

                <h3
                  className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}
                >
                  {partner.name}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Official Partner
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection4;
