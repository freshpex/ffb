import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../css/animations.css";

gsap.registerPlugin(ScrollTrigger);

const AboutSection3 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const timelineRef = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll(".timeline-item");
      const dots = timelineRef.current.querySelectorAll(".timeline-dot");
      const line = timelineRef.current.querySelector(".timeline-line-progress");

      // Animate the line growing
      gsap.fromTo(
        line,
        { height: "0%" },
        {
          height: "100%",
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        }
      );

      // Animate each timeline item
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { 
            opacity: 0, 
            x: index % 2 === 0 ? -50 : 50,
            scale: 0.9 
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate dots with pulse
      dots.forEach((dot, index) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: dot,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, []);

  const timeline = [
    {
      year: "2011",
      title: "Company Founded",
      description:
        "Fidelity First Brokers was established with a vision to provide innovative investment solutions to global clients.",
      color: "from-blue-500 to-cyan-400",
      glowColor: "rgba(59, 130, 246, 0.5)",
    },
    {
      year: "2013",
      title: "Expansion to Global Markets",
      description:
        "We expanded our operations to include major financial markets across Asia, Europe, and the Americas.",
      color: "from-purple-500 to-pink-400",
      glowColor: "rgba(168, 85, 247, 0.5)",
    },
    {
      year: "2015",
      title: "Introduction of Digital Platform",
      description:
        "Launched our state-of-the-art digital trading platform, enabling clients to trade from anywhere in the world.",
      color: "from-green-500 to-emerald-400",
      glowColor: "rgba(34, 197, 94, 0.5)",
    },
    {
      year: "2018",
      title: "Launch of Crypto Investment Services",
      description:
        "Pioneered cryptocurrency investment solutions, making digital assets accessible to our diverse client base.",
      color: "from-orange-500 to-yellow-400",
      glowColor: "rgba(249, 115, 22, 0.5)",
    },
    {
      year: "2020",
      title: "AI-Powered Analytics",
      description:
        "Integrated advanced AI technologies to enhance market analysis and investment recommendations.",
      color: "from-red-500 to-pink-400",
      glowColor: "rgba(239, 68, 68, 0.5)",
    },
    {
      year: "2023",
      title: "Recognition & Growth",
      description:
        "Recognized as one of the fastest-growing investment firms with over 25,000 active clients worldwide.",
      color: "from-indigo-500 to-purple-400",
      glowColor: "rgba(99, 102, 241, 0.5)",
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${darkMode ? "bg-gradient-to-b from-gray-800 to-gray-900" : "bg-gradient-to-b from-gray-50 to-white"}`}
    >
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              darkMode 
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                : "bg-indigo-100 text-indigo-600"
            }`}>
              Our Story
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-5xl font-bold mb-4`}
          >
            <span className={darkMode ? "text-white" : "text-gray-900"}>Our </span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Journey
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-3xl mx-auto text-lg`}
          >
            From our humble beginnings to becoming a global investment leader,
            our journey has been defined by innovation, resilience, and a
            relentless commitment to client success.
          </motion.p>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Timeline line background */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-1 ${darkMode ? "bg-gray-700" : "bg-gray-200"} hidden md:block rounded-full`}>
            {/* Animated progress line */}
            <div 
              className="timeline-line-progress absolute top-0 left-0 w-full rounded-full"
              style={{
                background: "linear-gradient(180deg, #6366f1, #8b5cf6, #ec4899, #f97316)",
              }}
            />
          </div>

          {/* Timeline entries */}
          <div className="space-y-12 relative">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`timeline-item flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center`}
              >
                <div
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                  } mb-6 md:mb-0`}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className={`p-6 rounded-2xl ${
                      darkMode 
                        ? "bg-gray-800/70 backdrop-blur-xl border border-gray-700/50" 
                        : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl"
                    }`}
                    style={{
                      boxShadow: `0 10px 40px -10px ${item.glowColor}`,
                    }}
                  >
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${item.color} text-white mb-3`}>
                      {item.year}
                    </span>
                    <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>
                      {item.title}
                    </h3>
                    <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                      {item.description}
                    </p>
                  </motion.div>
                </div>

                {/* Timeline dot */}
                <div className={`timeline-dot w-14 h-14 rounded-full flex items-center justify-center relative z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2`}>
                  <div 
                    className={`w-full h-full rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                    style={{
                      boxShadow: `0 0 20px ${item.glowColor}, 0 0 40px ${item.glowColor}`,
                    }}
                  >
                    <span className="font-bold text-white text-lg">{index + 1}</span>
                  </div>
                  {/* Pulse ring */}
                  <div 
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} animate-ping opacity-30`}
                    style={{ animationDuration: "2s" }}
                  />
                </div>

                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-16" : "md:pr-16 md:text-right"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection3;
