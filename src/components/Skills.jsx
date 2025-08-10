import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Skills = ({ skills, getSkillIcon }) => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 7,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 500,
    cssEase: "linear",
    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

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

  return (
    <motion.section
      id='skills'
      className='mt-20 px-4 sm:px-6 lg:px-15 py-10 border-none rounded-lg font-space tracking-widest overflow-hidden relative'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
      style={{ willChange: "opacity" }}
    >
      <motion.h2
        className='text-2xl md:text-3xl text-center text-space tracking-widest text-gray-600 font-semibold mb-2'
        style={{ color: "var(--color-text)" }}
        variants={textVariants}
      >
        My Tech Stack
      </motion.h2>

      <motion.p
        className='text-sm md:text-lg text-center leading-relaxed mb-8 font-space tracking-widest'
        style={{ color: "var(--color-text)" }}
        variants={textVariants}
      >
        Technologies I work with daily and love to use
      </motion.p>

      {/* Slider */}
      <div className='max-w-full w-full overflow-hidden relative py-4'>
        <Slider {...settings} draggable={false} className='flex w-full h-full'>
          {skills.map((skill, idx) => (
            <motion.div
              key={`${skill}-${idx}`}
              className='flex flex-col items-center justify-center px-1 py-2 h-full'
              whileHover={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ minHeight: "110px", height: "100%" }}
              whileTap={{ scale: 0.9 }}
            >
              <div className='flex items-center justify-center'>
                <img
                  src={getSkillIcon(skill)}
                  alt={skill}
                  className='w-14 h-14'
                />
              </div>
              <div className='text-xs sm:text-sm font-medium text-center'>
                <span
                  className='break-words '
                  style={{ color: "var(--color-text)" }}
                >
                  {skill}
                </span>
              </div>
            </motion.div>
          ))}
        </Slider>

        {/* Gradient fade effects */}
        <div
          className='absolute inset-y-0 left-0 w-20 pointer-events-none'
          style={{
            background:
              "linear-gradient(to right, var(--color-bg), transparent)",
          }}
        />
        <div
          className='absolute inset-y-0 right-0 w-20 pointer-events-none'
          style={{
            background:
              "linear-gradient(to left, var(--color-bg), transparent)",
          }}
        />
      </div>
    </motion.section>
  );
};

export default Skills;
