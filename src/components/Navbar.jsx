import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const Navbar = ({ navbar, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className='relative bg-transparent leading-relaxed top-0 w-full animate-fadeDown delay-400 px-4 sm:px-8 lg:px-15 pt-6 z-50'>
      <div className='flex justify-between items-center'>
        {/* Name */}
        <h1
          className='text-lg sm:text-xl font-medium tracking-widest cursor-pointer'
          style={{
            color: "var(--color-text)",
            transition: "color 0.2s ease-in-out",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = "var(--color-primary)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.color = "var(--color-text)")
          }
        >
          NIKHIL <strong>PATHAK</strong>
        </h1>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center space-x-6'>
          <ul
            className='flex space-x-6 text-sm sm:text-base leading-relaxed tracking-widest items-center'
            style={{ color: "var(--color-text)" }}
          >
            {navbar.map((item) => (
              <li key={item.href} className='options'>
                <a
                  href={item.href}
                  className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 px-1'
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden flex items-center gap-2'>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <motion.button
            ref={menuButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className='p-2 rounded-md relative z-50'
            aria-label='navigation menu'
            whileTap={{ scale: 0.9 }}
          >
            <LayoutGroup>
              <motion.div
                className='relative w-6 h-6'
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                <AnimatePresence mode='wait'>
                  {menuOpen ? (
                    <motion.div
                      key='close'
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        duration: 0.2,
                      }}
                      layout
                    >
                      <X
                        className='w-6 h-6 absolute'
                        style={{ color: "var(--color-text)" }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key='open'
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        duration: 0.2,
                      }}
                      layout
                    >
                      <Menu
                        className='w-6 h-6 absolute'
                        style={{ color: "var(--color-text)" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          </motion.button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial='hidden'
            animate='show'
            exit='exit'
            variants={menuVariants}
            className='absolute top-full left-0 w-full rounded-b-lg shadow-lg p-4 z-40'
            style={{
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
            }}
          >
            <motion.ul className='flex flex-col space-y-4 text-sm sm:text-base tracking-widest'>
              {navbar.map((item) => (
                <motion.li
                  key={item.href}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className='block hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
