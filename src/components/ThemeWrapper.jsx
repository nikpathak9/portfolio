import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const ThemeWrapper = ({ theme, toggleTheme, children }) => {
  // Initialize displayTheme with the persisted theme or prop
  const [displayTheme, setDisplayTheme] = useState(() => {
    // Check localStorage or fallback to theme prop
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || theme || "light";
    }
    return theme || "light";
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationOrigin = useRef({ x: 50, y: 50 });
  const wrapperRef = useRef(null);

  const getBgColor = (t) => (t === "dark" ? "#1a1a1d" : "#ffffff");
  const getTextColor = (t) => (t === "dark" ? "white" : "#424242");

  const handleThemeChange = (e) => {
    const themeToggle = e.target.closest('[aria-label^="Toggle"]');
    if (themeToggle && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      animationOrigin.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };

      setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setDisplayTheme(theme);
          setIsAnimating(false);
        }, 500);
      }, 300);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleThemeChange);
    return () => document.removeEventListener("click", handleThemeChange);
  }, [theme, displayTheme]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-full ${
        displayTheme === "dark" ? "dark" : ""
      }`}
      style={{
        backgroundColor: isAnimating
          ? getBgColor(displayTheme)
          : getBgColor(theme),
        color: getTextColor(displayTheme),
      }}
    >
      <div className='relative z-10 h-full'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={displayTheme}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key={`${theme}-transition`}
            className='fixed inset-0 z-20 pointer-events-none'
            style={{
              backgroundColor: getBgColor(theme), // overlay uses new theme color
            }}
            initial={{
              clipPath: `circle(0% at ${animationOrigin.current.x}% ${animationOrigin.current.y}%)`,
            }}
            animate={{
              clipPath: `circle(150% at ${animationOrigin.current.x}% ${animationOrigin.current.y}%)`,
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5 },
            }}
            transition={{
              duration: 1.5, // ⏳ slower than before
              ease: [0.22, 1, 0.36, 1], // smooth “easeOutExpo” feel
            }}
            onAnimationComplete={() => {
              setDisplayTheme(theme); // switch after spread completes
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeWrapper;
