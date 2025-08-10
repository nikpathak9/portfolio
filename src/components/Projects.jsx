import { ArrowRight, ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Projects = ({ projects, colors }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    checkMobile();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        mass: 0.5,
      },
    },
  };

  return (
    <section id='projects' className='mt-10 px-4 sm:px-8 lg:px-15'>
      <motion.h2
        className='text-2xl md:text-3xl text-center text-space tracking-widest text-gray-600 font-semibold mb-2'
        style={{ color: "var(--color-text)" }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, margin: "-50px" }}
      >
        Projects
      </motion.h2>

      <motion.p
        className='text-sm md:text-lg text-center leading-relaxed mb-8 font-space tracking-widest'
        style={{ color: "var(--color-text)" }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: false, margin: "-50px" }}
      >
        Selected works showcasing my approach to problem-solving and design
      </motion.p>

      <div className='max-w-7xl mx-auto flex flex-col gap-12'>
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              className={`p-4 group relative rounded-lg overflow-hidden bg-transparent border-none shadow-none
                flex flex-col-reverse md:flex-row
                ${isEven ? "md:flex-row-reverse" : "md:flex-row"}
              `}
              initial='hidden'
              whileInView='visible'
              variants={cardVariants}
              viewport={{ once: false, margin: "0px 0px -100px 0px" }}
              custom={index}
              style={{
                willChange: "transform, opacity",
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden",
              }}
              whileHover={
                !isMobile
                  ? {
                      scale: 0.98,
                      transition: { duration: 0.3 },
                    }
                  : undefined
              }
              whileTap={!isMobile ? { scale: 0.98 } : undefined}
            >
              {/* Content Area */}
              <div className='md:w-1/2 px-2 py-4 md:px-6 md:py-2 bg-transparent flex flex-col gap-4'>
                <h3
                  className='font-semibold text-xl text-gray-900 font-space tracking-wider'
                  style={{ color: "var(--color-text)" }}
                >
                  {project.title}
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {project.tags.map((tag, i) => {
                    const colorIndex = i % colors.length;
                    return (
                      <span
                        key={i}
                        className={`text-xs px-2 py-0.5 rounded-full ${colors[colorIndex]}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <p
                  className='text-gray-600 text-sm leading-relaxed line-clamp-3 font-space tracking-widest'
                  style={{ color: "var(--color-text)" }}
                >
                  {project.description}
                </p>

                {/* Mobile simple button */}
                {isMobile && (
                  <div className='w-full flex justify-start mb-4'>
                    <a
                      href={project.preview}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='bg-white rounded-md px-6 py-3 shadow-lg flex items-center gap-2 text-gray-900 font-medium transition-colors duration-300 hover:bg-gray-100'
                    >
                      View Live
                      <ExternalLink className='w-4 h-4' />
                    </a>
                  </div>
                )}
              </div>

              {/* Image Area */}
              <div className='md:w-1/2 relative w-full aspect-video overflow-hidden rounded-lg shadow-md group cursor-pointer'>
                {/* MacOS-style window header */}
                <div className='bg-gray-50 px-3 py-2 flex items-center justify-between border-b border-gray-200'>
                  <div className='flex space-x-2 mr-3'>
                    <span className='w-2 h-2 md:w-2.5 md:h-2.5 bg-red-400 rounded-full'></span>
                    <span className='w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-400 rounded-full'></span>
                    <span className='w-2 h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full'></span>
                  </div>
                  <div className='mx-2 w-full bg-white rounded h-3.5 border border-gray-200' />
                  <ArrowRight className='w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 transition-colors duration-300' />
                </div>

                <div className='relative h-full'>
                  <img
                    src={project.src}
                    alt={`${project.title} Preview`}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                    loading='lazy'
                    style={{ transform: "translateZ(0)" }}
                  />

                  {/* Desktop Overlay */}
                  {!isMobile && (
                    <motion.div
                      className='absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                      initial={{
                        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                      }}
                      animate={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{ pointerEvents: "auto" }}
                    >
                      <motion.a
                        href={project.preview}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 px-6 py-3 bg-white rounded-md shadow-lg'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <span className='font-medium text-gray-900'>
                          View Live
                        </span>
                        <ExternalLink className='w-4 h-4 text-gray-900' />
                      </motion.a>
                    </motion.div>
                  )}
                </div>

                <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent pointer-events-none rounded-lg'></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
