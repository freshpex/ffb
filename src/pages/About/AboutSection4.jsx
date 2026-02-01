import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FaUserTie, FaUniversity, FaChartBar, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../css/animations.css";

gsap.registerPlugin(ScrollTrigger);

const AboutSection4 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const teamRef = useRef(null);
  const partnersRef = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    // Team cards animation
    if (teamRef.current) {
      const cards = teamRef.current.querySelectorAll(".team-card");
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, rotateY: 20 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Partners animation
    if (partnersRef.current) {
      const items = partnersRef.current.querySelectorAll(".partner-card");
      gsap.fromTo(
        items,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: partnersRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const teamMembers = [
    {
      name: "Michael Wilson",
      position: "Chief Executive Officer",
      bio: "With over 20 years of experience in the financial sector, Michael has led Fidelity First Brokers to become a global leader in investment services.",
      image: "/src/assets/images/team/ceo.jpg",
      gradient: "from-blue-500 to-cyan-400",
      glowColor: "rgba(59, 130, 246, 0.4)",
    },
    {
      name: "Sarah Johnson",
      position: "Chief Investment Officer",
      bio: "Sarah's expertise in portfolio management and market analysis has been instrumental in delivering consistent returns for our clients.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD7I3tXCAEF4qRppLl6Pqp7vEe0lfTsSbBXg&s",
      gradient: "from-purple-500 to-pink-400",
      glowColor: "rgba(168, 85, 247, 0.4)",
    },
    {
      name: "David Chen",
      position: "Chief Technology Officer",
      bio: "David has pioneered the integration of AI and blockchain technologies into our trading platforms, enhancing security and performance.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmM2Rog65egKj4QaN4nNbAMb7kyEP1Blg27A&s",
      gradient: "from-green-500 to-emerald-400",
      glowColor: "rgba(34, 197, 94, 0.4)",
    },
    {
      name: "Emily Rodriguez",
      position: "Head of Client Relations",
      bio: "Emily's dedication to client satisfaction has established our reputation for exceptional service and personalized investment solutions.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPkYGauObGWMk4rFAQuFVASzepRLdhQj9Mgw&s",
      gradient: "from-orange-500 to-red-400",
      glowColor: "rgba(249, 115, 22, 0.4)",
    },
  ];

  const partners = [
    {
      name: "Global Financial Exchange",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfwcOzl2EAzUvaOJW-1U8OFhyAYV51n_2hyw&s",
      icon: <FaGlobe />,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      name: "Investment Banking Institute",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpa-TSm31XCMAgVh5J1d7neMQunK-xDBJWEA&s",
      icon: <FaUniversity />,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Market Analysis Group",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCxOyLZEDUhxp5v_KXpwE8Qx-eGmkIpcPxIA&s",
      icon: <FaChartBar />,
      gradient: "from-green-500 to-teal-500",
    },
    {
      name: "International Traders Association",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjHQj2VDsR2VWw2dM8OZV13S_OmaG5InYgLw&s",
      icon: <FaUserTie />,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${darkMode ? "bg-gray-900/80" : "bg-gray-100"}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${darkMode ? "bg-blue-500/10" : "bg-blue-500/5"} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${darkMode ? "bg-purple-500/10" : "bg-purple-500/5"} rounded-full blur-3xl`} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Leadership Team */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-block mb-4"
            >
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                darkMode 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                  : "bg-blue-100 text-blue-600"
              }`}>
                Meet Our Team
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-5xl font-bold mb-4`}
            >
              <span className={darkMode ? "text-white" : "text-gray-900"}>Our </span>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Leadership Team
              </span>
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

          <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card group"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-800/70 backdrop-blur-xl border border-gray-700/50"
                      : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl"
                  }`}
                  style={{
                    boxShadow: `0 20px 50px -15px ${member.glowColor}`,
                  }}
                >
                  {/* Image container */}
                  <div className="relative h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-20`} />
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${member.name.replace(" ", "+")}&background=0D8ABC&color=fff&size=200`;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${member.gradient}`}>
                        <span className="text-6xl font-bold text-white/80">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Social overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <div className="flex gap-4">
                        <motion.a
                          href="#"
                          whileHover={{ scale: 1.2 }}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                        >
                          <FaLinkedin />
                        </motion.a>
                        <motion.a
                          href="#"
                          whileHover={{ scale: 1.2 }}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-400 transition-colors"
                        >
                          <FaTwitter />
                        </motion.a>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3`}>
                      {member.position}
                    </p>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm leading-relaxed`}>
                      {member.bio}
                    </p>
                  </div>
                  
                  {/* Bottom gradient accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partners and Affiliations */}
        <div>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-block mb-4"
            >
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                darkMode 
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                  : "bg-purple-100 text-purple-600"
              }`}>
                Trusted Partners
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-4xl font-bold mb-4`}
            >
              <span className={darkMode ? "text-white" : "text-gray-900"}>Our Partners & </span>
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Affiliations
              </span>
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

          <div ref={partnersRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                className="partner-card group"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className={`p-6 rounded-2xl transition-all duration-500 flex flex-col items-center text-center ${
                    darkMode
                      ? "bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 hover:border-purple-500/50"
                      : "bg-white/80 backdrop-blur-xl border border-gray-200/50 hover:border-purple-500/50 shadow-lg"
                  }`}
                >
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center text-white text-2xl mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {partner.icon}
                  </div>

                  <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>
                    {partner.name}
                  </h3>
                  <p className={`text-sm font-medium bg-gradient-to-r ${partner.gradient} bg-clip-text text-transparent`}>
                    Official Partner
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection4;
