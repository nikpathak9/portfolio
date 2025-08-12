import { motion } from "framer-motion";

const Experience = ({ experiences, extractSkills, skillColors }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      id='experience'
      className='mt-20 px-4 sm:px-6 lg:px-15 py-10 border-none shadow-none rounded-lg'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
      style={{ willChange: "opacity" }}
    >
      <motion.h2
        className='text-2xl md:text-3xl  text-center text-space tracking-widest text-gray-600 font-semibold mb-2'
        style={{ color: "var(--color-text)" }}
        variants={textVariants}
      >
        Experience
      </motion.h2>

      <motion.p
        className='text-sm md:text-lg text-center leading-relaxed mb-8 font-space tracking-widest'
        style={{ color: "var(--color-text)" }}
        variants={textVariants}
      >
        My journey in the tech industry
      </motion.p>

      <div className='relative'>
        {/* Timeline line */}
        <motion.div
          className='absolute left-1 top-0 w-0.5 bg-gray-200 origin-top sm:left-2'
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ willChange: "height" }}
        />

        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            className='relative mb-10 sm:mb-12 pl-8 sm:pl-10 group'
            variants={cardVariants}
            style={{ willChange: "transform, opacity" }}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: false, amount: 0.2 }}
          >
            {/* Timeline dot */}
            <div className='absolute left-0 sm:left-0 top-2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-indigo-500 shadow-md group-hover:bg-indigo-600 transition-colors duration-300' />

            {/* Experience card */}
            <div className='p-4 sm:p-5 bg-transparent rounded-lg shadow-none border-none transition-all duration-300 hover:scale-95'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                {/* Company logo */}
                <div className='flex-shrink-0 p-2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white flex items-center justify-center overflow-hidden'>
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    className='mix-blend-darken object-contain'
                    loading='lazy'
                  />
                </div>

                <div className='flex-1 w-full'>
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2'>
                    <div>
                      <h3
                        className='text-base sm:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 text-space tracking-widest'
                        style={{ color: "var(--color-text)" }}
                      >
                        {exp.title}
                      </h3>
                      <p
                        className='text-gray-700 font-medium text-xs sm:text-sm mt-1 group-hover:text-gray-900 transition-colors duration-300 font-space tracking-widest'
                        style={{ color: "var(--color-text)" }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span className='text-[10px] sm:text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors duration-300 border border-indigo self-start sm:self-auto'>
                      {exp.duration}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {extractSkills(exp.description).map((skill, i) => (
                      <span
                        key={i}
                        className={`text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${
                          skillColors[skill] || "bg-gray-100 text-gray-700"
                        } group-hover:shadow-sm transition-all duration-300`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p
                    className='mt-2 text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300 font-space tracking-widest'
                    style={{ color: "var(--color-text)" }}
                  >
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Experience;
