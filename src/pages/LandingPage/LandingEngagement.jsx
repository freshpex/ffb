import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaChartLine, FaRegCompass, FaShieldAlt, FaTimes } from "react-icons/fa";

const MARKETING_PATHS = new Set(["/", "/about", "/contact", "/services", "/pricing", "/resources/guides", "/resources/videos", "/resources/market-analysis", "/resources/faqs"]);
const MESSAGES = [
  { eyebrow: "Build a clearer plan", title: "Explore investment options at your pace", body: "Compare available plans, understand the terms, and choose only what fits your goals and risk tolerance.", icon: FaRegCompass, action: "Explore plans", href: "/pricing" },
  { eyebrow: "Trade with context", title: "Markets move. Your process should stay disciplined.", body: "Use broker-connected trading tools, market education, and account controls from one place.", icon: FaChartLine, action: "Create an account", href: "/signup" },
  { eyebrow: "Start securely", title: "Your guided account setup takes you step by step", body: "Create your profile, secure your login, complete identity verification, and then add a payment method.", icon: FaShieldAlt, action: "Get started", href: "/signup" },
];

export default function LandingEngagement() {
  const { pathname } = useLocation();
  const enabled = MARKETING_PATHS.has(pathname);
  const [visible, setVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const message = useMemo(() => MESSAGES[messageIndex % MESSAGES.length], [messageIndex]);
  const Icon = message.icon;

  useEffect(() => {
    setVisible(false);
    setDismissed(false);
    setMessageIndex(0);
  }, [pathname]);

  useEffect(() => {
    if (!enabled || dismissed) return undefined;
    const onScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const progress = available > 0 ? window.scrollY / available : 0;
      if (progress >= 0.18) setVisible(true);
      if (progress >= 0.58) setMessageIndex(1);
      if (progress >= 0.82) setMessageIndex(2);
    };
    const timer = window.setTimeout(() => setVisible(true), 6500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [dismissed, enabled]);

  if (!enabled) return null;

  return (
    <>
      <AnimatePresence>
        {visible && !dismissed && (
          <motion.aside
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-[390px] z-[60] rounded-2xl border border-primary-400/30 bg-gray-950/95 text-white shadow-2xl backdrop-blur-xl overflow-hidden"
            aria-live="polite"
          >
            <div className="h-1 bg-gradient-to-r from-primary-500 via-cyan-400 to-emerald-400" />
            <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10"><FaTimes /></button>
            <div className="p-5 pr-12">
              <div className="w-11 h-11 rounded-xl bg-primary-500/20 text-primary-300 flex items-center justify-center text-xl"><Icon /></div>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] font-bold text-primary-300">{message.eyebrow}</p>
              <h2 className="mt-1 text-xl font-bold leading-tight">{message.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{message.body}</p>
              <div className="mt-4 flex items-center gap-4">
                <Link to={message.href} className="inline-flex items-center gap-2 rounded-full bg-primary-600 hover:bg-primary-500 px-4 py-2.5 text-sm font-semibold">{message.action} <FaArrowRight /></Link>
                <button onClick={() => setMessageIndex((value) => value + 1)} className="text-sm font-medium text-gray-300 hover:text-white">Show another</button>
              </div>
              <p className="mt-3 text-[10px] text-gray-500">Investing and trading involve risk. Review the terms before committing funds.</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {dismissed && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setDismissed(false); setVisible(true); }} className="fixed bottom-5 right-5 z-[55] rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
          <FaChartLine /> Explore opportunities
        </motion.button>
      )}
    </>
  );
}
