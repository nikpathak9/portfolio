import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, LinkedinIcon, Send, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactUs({ theme }) {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    const toastId = toast.loading("Sending message...");

    emailjs
      .sendForm(
        "service_5glwr3n",
        "template_eg6undi",
        form.current,
        "GqAD5bXUaQlhweSnD",
        { time: new Date().toLocaleString() }
      )
      .then(
        () => {
          toast.success("Message sent successfully!", { id: toastId });
          form.current.reset();
          setIsSending(false);
        },
        () => {
          toast.error("Failed to send message. Please try again later.", {
            id: toastId,
          });
          setIsSending(false);
        }
      );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
    hover: {
      scale: 1.03,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  // Color definitions
  const colors = {
    light: {
      cardBg: "#F8F9FA", // Gray-50
      cardBorder: "#E5E7EB", // Platinum
      inputBg: "#F0F0FF", // Gray-50
      inputBorder: "#ADADAD", // Platinum
      hoverBg: "#E5E7EB", // Platinum
      textPrimary: "#1A202C", // Dark Slate Gray
      textSecondary: "#374151", // Gray-700
    },
    dark: {
      cardBg: "#212529", // Dark Slate Gray
      cardBorder: "#2D3748", // Gray-800
      inputBg: "#2D3748", // Gray-800
      inputBorder: "#4B5563", // Gray-600
      hoverBg: "#374151", // Gray-700
      textPrimary: "#FFFFFF", // Pure White
      textSecondary: "#E5E7EB", // Platinum
    },
  };

  const currentColors = colors[theme];

  return (
    <section
      id='contact'
      className='relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 font-sans'
    >
      {/* Decorative indigo glow */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute left-1/2 top-0 h-[500px] w-[300px] -translate-x-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-30 blur-3xl'></div>
      </div>

      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: false, margin: "-100px" }}
        variants={containerVariants}
        className='max-w-7xl mx-auto'
      >
        <div className='text-center mb-16'>
          <motion.h2
            variants={itemVariants}
            className='text-2xl md:text-3xl tracking-widest font-semibold mb-2'
            style={{ color: "var(--color-text)" }}
          >
            Let's Connect
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className='text-sm md:text-lg leading-relaxed mb-8 tracking-widest'
            style={{ color: "var(--color-text-secondary)" }}
          >
            Have a project in mind or want to discuss opportunities? I'd love to
            hear from you.
          </motion.p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <motion.div variants={cardVariants} className='space-y-8'>
            <motion.div
              variants={itemVariants}
              className={`p-8 rounded-2xl shadow-xl`}
              style={{
                background: currentColors.cardBg,
                borderColor: currentColors.cardBorder,
              }}
            >
              <h3
                className='text-xl font-semibold mb-4'
                style={{ color: "#4f46e5" }}
              >
                Availability
              </h3>
              <p
                className='mb-6'
                style={{ color: currentColors.textSecondary }}
              >
                I'm currently open to new opportunities and collaborations. Feel
                free to reach out anytime!
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`p-8 rounded-2xl shadow-xl`}
              style={{
                backgroundColor: currentColors.cardBg,
                borderColor: currentColors.cardBorder,
              }}
              whileHover='hover'
            >
              <h3
                className='text-xl font-semibold mb-6'
                style={{ color: "#4f46e5" }}
              >
                Contact Information
              </h3>

              <div className='space-y-6'>
                {[
                  {
                    icon: <Mail className='h-6 w-6' />,
                    label: "Email",
                    value: "nikpathak099@gmail.com",
                    href: "mailto:nikpathak099@gmail.com",
                  },
                  {
                    icon: <LinkedinIcon className='h-6 w-6' />,
                    label: "LinkedIn",
                    value: "linkedin.com/in/nikhilpathak",
                    href: "https://linkedin.com/in/nikhil-pathak-597708196",
                  },
                  {
                    icon: <Phone className='h-6 w-6' />,
                    label: "Phone",
                    value: "+91 9131665230",
                    href: "tel:+919131665230",
                  },
                  {
                    icon: <MapPin className='h-6 w-6' />,
                    label: "Location",
                    value: "Bangalore, India",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all`}
                    style={{
                      backgroundColor:
                        theme === "light"
                          ? currentColors.hoverBg
                          : `${currentColors.hoverBg}80`,
                      backdropFilter: theme === "dark" ? "blur(4px)" : "none",
                    }}
                    whileHover='hover'
                  >
                    <div
                      className={`flex-shrink-0 p-3 rounded-lg bg-indigo-500/10 text-indigo-500`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4
                        className='text-base font-medium'
                        style={{
                          color: currentColors.textPrimary,
                        }}
                      >
                        {item.label}
                      </h4>
                      {item.href ? (
                        <a
                          href={item.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='mt-1 text-indigo-500 hover:text-indigo-400 transition-colors break-words'
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p
                          className={`mt-1`}
                          style={{ color: currentColors.textSecondary }}
                        >
                          {item.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={cardVariants}
            className={`p-8 rounded-2xl shadow-xl`}
            style={{
              backgroundColor: currentColors.cardBg,
              borderColor: currentColors.cardBorder,
            }}
          >
            <motion.h3
              variants={itemVariants}
              className='text-2xl font-bold mb-8 text-indigo-500'
            >
              Send me a message
            </motion.h3>

            <form ref={form} onSubmit={sendEmail} className='space-y-6'>
              <input
                type='hidden'
                name='time'
                value={new Date().toLocaleString()}
              />

              {[
                {
                  id: "name",
                  label: "Name",
                  type: "text",
                  name: "from_name",
                  placeholder: "Your name",
                },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  name: "from_email",
                  placeholder: "you@example.com",
                },
              ].map((field, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <div className='space-y-2'>
                    <label
                      htmlFor={field.id}
                      className='block text-sm font-medium'
                      style={{
                        color: currentColors.textSecondary,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500/50 transition-all focus:outline-none`}
                      style={{
                        background: currentColors.inputBg,
                        border: "1px solid" + currentColors.inputBorder,
                        color: currentColors.textPrimary,
                      }}
                      required
                    />
                  </div>
                </motion.div>
              ))}

              <motion.div variants={itemVariants}>
                <div className='space-y-2'>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium'
                    style={{ color: currentColors.textSecondary }}
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    rows='5'
                    placeholder='Your message...'
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all`}
                    style={{
                      backgroundColor: currentColors.inputBg,
                      border: "1px solid" + currentColors.inputBorder,
                      color: currentColors.textPrimary,
                    }}
                    required
                  ></textarea>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type='submit'
                  disabled={isSending}
                  className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-lg transition-all shadow-lg ${
                    isSending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                  } text-white`}
                >
                  {isSending ? (
                    <div className='flex items-center'>
                      <div className='w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2'></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className='h-5 w-5' />
                      Send Message
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
