import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

const AboutSection1 = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      className={`relative py-24 px-4 overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 ${
            darkMode ? "bg-primary-600/10" : "bg-primary-300/20"
          } rounded-full blur-3xl`}
        ></div>
        <div
          className={`absolute bottom-1/3 right-1/4 w-80 h-80 ${
            darkMode ? "bg-blue-600/10" : "bg-blue-300/20"
          } rounded-full blur-3xl`}
        ></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <h1
              className={`text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              About <span className="text-primary-500">Fidelity First</span>{" "}
              Brokers
            </h1>
            <p
              className={`text-lg mb-8 leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We are a leading global investment firm dedicated to helping our
              clients build wealth and achieve their financial goals. With over
              a decade of experience, we combine cutting-edge technology with
              financial expertise to deliver exceptional results.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div
                className={`flex items-center px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700 text-gray-400"
                    : "bg-gray-200 border-gray-300 text-gray-700"
                }`}
              >
                <span className="text-primary-500 text-3xl font-bold mr-2">
                  12+
                </span>
                <span className="text-sm">Years of Experience</span>
              </div>
              <div
                className={`flex items-center px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700 text-gray-400"
                    : "bg-gray-200 border-gray-300 text-gray-700"
                }`}
              >
                <span className="text-primary-500 text-3xl font-bold mr-2">
                  25k+
                </span>
                <span className="text-sm">Happy Clients</span>
              </div>
              <div
                className={`flex items-center px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700 text-gray-400"
                    : "bg-gray-200 border-gray-300 text-gray-700"
                }`}
              >
                <span className="text-primary-500 text-3xl font-bold mr-2">
                  97%
                </span>
                <span className="text-sm">Client Satisfaction</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div
              className={`relative rounded-2xl overflow-hidden shadow-xl border ${
                darkMode ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <img
                src="/src/assets/images/team.jpg"
                alt="Fidelity First Team"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80";
                }}
              />
              <div
                className={`absolute inset-0 ${
                  darkMode
                    ? "bg-gradient-to-t from-gray-900 to-transparent opacity-70"
                    : "bg-gradient-to-t from-gray-100 to-transparent opacity-70"
                }`}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Building Trust Since 2011
                </h3>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Empowering investors with confidence and knowledge.
                </p>
              </div>
            </div>

            {/* Decorative element */}
            <div
              className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-xl ${
                darkMode ? "bg-primary-500/20" : "bg-primary-300/20"
              }`}
            ></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection1;
