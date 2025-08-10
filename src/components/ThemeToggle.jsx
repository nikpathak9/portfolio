import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className='relative w-16 h-8 flex items-center rounded-full 
                 p-1 focus:outline-none shadow-md transition-colors duration-300'
      style={{
        background: theme === "light" ? "#1a1a1d" : "#ffffff",
      }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Sliding thumb */}
      <motion.div
        className='w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors duration-200'
        style={{
          backgroundColor: "var(--color-bg)",
        }}
        initial={false}
        animate={{
          x: theme === "light" ? 0 : 32,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <AnimatePresence mode='wait' initial={false}>
          {theme === "light" ? (
            <motion.div
              key='sun'
              initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className='w-4 h-4' style={{ color: "var(--color-text)" }} />
            </motion.div>
          ) : (
            <motion.div
              key='moon'
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon
                className='w-4 h-4'
                style={{ color: "var(--color-text)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
