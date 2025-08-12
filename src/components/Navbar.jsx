import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({ navbar, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='bg-transparent leading-relaxed top-0 w-full animate-fadeDown delay-400 px-4 sm:px-8 lg:px-15 pt-6'>
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
        <div className='md:hidden flex items-center'>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='p-2 rounded-md'
            aria-label='Toggle navigation menu'
          >
            {menuOpen ? (
              <X className='w-6 h-6' style={{ color: "var(--color-text)" }} />
            ) : (
              <Menu
                className='w-6 h-6'
                style={{ color: "var(--color-text)" }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className='md:hidden mt-4 rounded-lg shadow-lg p-4 transition-all duration-300'
          style={{
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          <ul className='flex flex-col space-y-4 text-sm sm:text-base tracking-widest'>
            {navbar.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className='block hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
