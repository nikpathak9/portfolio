import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, LinkedinIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactUs({ theme }) {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending message...");

    emailjs
      .sendForm(
        "service_5glwr3n",
        "template_eg6undi",
        form.current,
        "GqAD5bXUaQlhweSnD",
        {
          time: new Date().toLocaleString(),
        }
      )
      .then(
        () => {
          toast.success("Message sent successfully!", { id: toastId });
          form.current.reset();
        },
        () => {
          toast.error("Failed to send message. Please try again later.", {
            id: toastId,
          });
        }
      );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
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
    <section
      id='contact'
      className='mt-10 px-4 sm:px-6 lg:px-15 py-10 bg-transparent font-space tracking-widest'
    >
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2
          variants={itemVariants}
          className='text-2xl md:text-3xl text-center font-bold text-gray-900 tracking-widest mb-6'
          style={{ color: "var(--color-text)" }}
        >
          Let's Connect
        </motion.h2>

        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16'>
          {/* Left Column */}
          <motion.div
            variants={itemVariants}
            className='space-y-8'
            style={{ willChange: "transform, opacity" }}
          >
            <motion.p
              variants={itemVariants}
              className='mt-3 text-sm md:text-lg text-gray-600 text-center md:text-left'
              style={{ color: "var(--color-text)" }}
            >
              I'm currently open to new opportunities and would love to hear
              from you.
            </motion.p>

            <div className='space-y-6'>
              <motion.div
                variants={itemVariants}
                className='flex flex-col gap-4 sm:flex-row sm:items-start sm:space-x-4 text-center sm:text-left'
                style={{ willChange: "transform, opacity" }}
              >
                <div className='flex-shrink-0 mx-auto sm:mx-0 bg-indigo-100 p-3 rounded-lg'>
                  <Mail className='h-6 w-6 text-indigo-600' />
                </div>
                <div>
                  <h3
                    className='text-lg font-medium text-gray-900'
                    style={{ color: "var(--color-text)" }}
                  >
                    Email
                  </h3>
                  <a
                    href='mailto:nikpathak099@gmail.com'
                    className='break-words text-indigo-600 hover:text-indigo-800 transition-colors'
                  >
                    nikpathak099@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='flex flex-col gap-4 sm:flex-row sm:items-start sm:space-x-4 text-center sm:text-left'
                style={{ willChange: "transform, opacity" }}
              >
                <div className='flex-shrink-0 mx-auto sm:mx-0 bg-indigo-100 p-3 rounded-lg'>
                  <LinkedinIcon className='h-6 w-6 text-indigo-600' />
                </div>
                <div>
                  <h3
                    className='text-lg font-medium text-gray-900'
                    style={{ color: "var(--color-text)" }}
                  >
                    LinkedIn
                  </h3>
                  <a
                    href='https://linkedin.com/in/nikhil-pathak-597708196'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='break-words text-indigo-600 hover:text-indigo-800 transition-colors'
                  >
                    linkedin.com/in/nikhilpathak
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            variants={itemVariants}
            className='p-6 sm:p-8 rounded-3xl border border-none shadow-none'
            style={{
              willChange: "transform, opacity",
              backgroundColor: theme === "light" ? "#212121" : "#ffffff",
            }}
          >
            <motion.h3
              variants={itemVariants}
              className='text-xl sm:text-2xl font-bold text-gray-900 mb-6 tracking-widest text-center md:text-left'
              style={{ color: theme === "light" ? "#ffffff" : "#1a1a1d" }}
            >
              Send me a message
            </motion.h3>
            <form ref={form} onSubmit={sendEmail} className='space-y-6'>
              <div className='grid grid-cols-1 gap-6'>
                <input
                  type='hidden'
                  name='time'
                  value={new Date().toLocaleString()}
                />

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-1'
                    style={{ color: theme === "light" ? "#ffffff" : "#1a1a1d" }}
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='from_name'
                    placeholder='Your name'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg'
                    style={{ color: theme === "light" ? "#ffffff" : "#1a1a1d" }}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-1'
                    style={{ color: theme === "light" ? "#ffffff" : "#1a1a1d" }}
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='from_email'
                    placeholder='you@example.com'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg'
                    style={{ color: theme === "light" ? "#ffffff" : "#1a1a1d" }}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-700 mb-1'
                    style={{ color: theme === "light" ? "#ffffff" : "#1a1a1d" }}
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    rows='4'
                    placeholder='Your message...'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg'
                    style={{ color: theme === "light" ? "#ffffff" : "#1a1a1d" }}
                    required
                  ></textarea>
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium py-3 px-6 rounded-lg'
                >
                  Send Message
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
