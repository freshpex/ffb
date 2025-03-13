import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HomePageSection4 = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener("mousemove", handleMouseMove);
        
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);
    
    const navigateTo = (url) => {
        console.log("clicked");
        navigate(url);
    };
    
    // Calculate the parallax effect based on mouse position
    const calculateParallax = (strength = 0.03) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (mousePosition.x - centerX) * strength;
        const moveY = (mousePosition.y - centerY) * strength;
        
        return {
            transform: `translate(${moveX}px, ${moveY}px)`
        };
    };

    return (
        <>
            <section className="homepagesection4" data-aos="fade-up">
                <div className="parallax-bg" style={calculateParallax(0.02)}></div>
                <motion.div 
                    className="innerbox"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        JOIN OTHER REGISTERED USERS
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Open Account today and start trading
                    </motion.p>
                    
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link
                            to={`/signup`}
                            className="link"
                            onClick={() => navigateTo(`/signup`)}
                        >
                            Sign Up
                        </Link>
                    </motion.button>
                </motion.div>
            </section>
        </>
    );
};

export default HomePageSection4;