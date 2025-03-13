import { Link, useNavigate } from "react-router-dom";
import "/src/css/auth.css";
import { useState } from "react";
import { UserAuth } from './AuthContext';
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {signIn} = UserAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('');

    try {
        await signIn(email, password)
        navigate("/login/dashboardpage")
    } catch (e) {
        setError(e.message)
        console.log(e.message);
    }
  }

  return (
    <>
      <section className="login__section">
        <motion.div 
          className="innerbox"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="left__container"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="logo">
              <Link className="link" to={"/"}>
                <h1>FFB</h1>
                <p>Fidelity First Brokers</p>
              </Link>
            </div>
            <h1>Welcome Back</h1>
            <p>The world of Investing is already waiting...</p>

            <form action="" onSubmit={handleSubmit}>
              <label htmlFor="email">
                Email address <br />{" "}
              </label>
              <input
                type="email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password">
                Password <br />{" "}
              </label>
              <input
                type="password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <p className="forgot-password">Forgot your password?</p>
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log in
              </motion.button>
              <p>
                <Link className="link" to="/signup">
                  Don&apos;t have an account yet? Sign Up...
                </Link>
              </p>
            </form>
          </motion.div>
          
          <motion.div 
            className="right__container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1>Invest in you, no matter where you`re going</h1>
            <p>
              No matter your budget, take a confident step closer to your goals
              today and embrace a promising future.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Login;
