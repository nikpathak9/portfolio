import { motion } from "framer-motion";
import { style } from "framer-motion/client";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

const Header = ({ header, iconMap }) => {
  const [initialX, setInitialX] = useState(0);

  useEffect(() => {
    function updateInitialX() {
      if (window.innerWidth >= 768) {
        setInitialX(-50);
      } else {
        setInitialX(0);
      }
    }
    updateInitialX();
    window.addEventListener("resize", updateInitialX);
    return () => window.removeEventListener("resize", updateInitialX);
  }, []);

  return (
    <header
      id='home'
      className='flex flex-col-reverse md:flex-row items-center md:items-start justify-between mt-20 px-4 sm:px-8 lg:p-15 border-none shadow-none rounded-lg'
    >
      {/* Left Content */}
      <motion.div
        className='w-full md:w-3/5 text-center md:text-left mt-10 md:mt-0'
        initial={{ opacity: 1, x: initialX }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: false, amount: 0.2 }}
        style={{
          transformOrigin: "left center",
        }}
      >
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 h-auto flex justify-center md:justify-start items-center'>
          <TypeAnimation
            sequence={[
              header.title,
              2000,
              "",
              500,
              "A Frontend Developer",
              2000,
              "",
              500,
            ]}
            repeat={Infinity}
            speed={30}
            deletionSpeed={60}
            wrapper='span'
            cursor={true}
            style={{
              display: "inline-block",
              overflow: "hidden",
              color: "var(--color-text)",
            }}
            className='type-animation animate-fadeInUp delay-50 font-space tracking-widest'
          />
        </h1>

        <p
          className='mt-3 text-lg sm:text-xl text-gray-600 leading-relaxed animate-fadeInUp delay-100 font-space tracking-widest'
          style={{ color: "var(--color-text)" }}
        >
          {header.subtitle}
        </p>

        <div className='space-y-6 mt-6 text-base sm:text-lg'>
          <p
            className='text-gray-600 leading-relaxed animate-fadeInUp delay-200 font-space tracking-widest'
            style={{ color: "var(--color-text)" }}
          >
            {header.description1}
          </p>

          <p
            className='text-gray-600 leading-relaxed animate-fadeInUp delay-300 font-space tracking-widest'
            style={{ color: "var(--color-text)" }}
          >
            {header.description2.split("Hire Me?")[0]}
            <strong className='relative inline-block'>
              <span className='relative z-10'>Hire Me?</span>
              <span
                className='absolute bottom-0 left-0 w-full h-1 bg-indigo-200 -z-0 
                group-hover:h-full transition-all duration-300 ease-out'
                style={{ transitionProperty: "height" }}
              ></span>
            </strong>
          </p>
        </div>

        <motion.div
          className='mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start animate-fadeUp delay-400'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          {header.links.map((link) => {
            const Icon = iconMap[link.icon];

            return (
              <a
                key={link.label}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base hover:text-indigo-600 ${
                  link.style === "primary"
                    ? "bg-black text-white shadow-sm hover:bg-gray-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                    : "bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 hover:text-gray-900 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group relative overflow-hidden"
                }`}
              >
                {Icon && <Icon className='w-4 h-4 sm:w-5 sm:h-5' />}
                <span className='font-space tracking-widest'>{link.label}</span>
                {link.label === "Resume" && (
                  <span className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                )}
              </a>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Right Image Section */}
      <div className='w-full md:w-2/5 flex justify-center md:justify-end mt-8 md:mt-0 animate-fadeInUp delay-400'>
        <img
          src={header.profileImage}
          alt='Nikhil Pathak'
          className='w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover 
          rounded-full shadow-md hover:shadow-lg transition-all duration-500 ease-in-out 
          hover:scale-105 border-4 border-white/20 hover:border-white/40'
        />
      </div>
    </header>
  );
};

export default Header;
