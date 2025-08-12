import data from "./data/data.json";
import {
  FileUser,
  Github,
  Linkedin,
  LinkedinIcon,
  Mail,
  Moon,
} from "lucide-react";

import { FiCode } from "react-icons/fi";
import { useTheme } from "./context/ThemeContext";
import ThemeWrapper from "./components/ThemeWrapper";
import ContactUs from "./components/ContactUs";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";

const getSkillIcon = (skill) => {
  const iconClass =
    "w-8 h-8 text-gray-700 group-hover:text-indigo-600 transition-colors";

  const icons = {
    React: "https://www.svgrepo.com/show/452092/react.svg",
    Tailwind: "https://www.svgrepo.com/show/374118/tailwind.svg",
    Redux: "https://www.svgrepo.com/show/452093/redux.svg",
    JavaScript: "https://www.svgrepo.com/show/303206/javascript-logo.svg",
    HTML: "https://www.svgrepo.com/show/373669/html.svg",
    CSS: "https://www.svgrepo.com/show/452185/css-3.svg",
    Svelte: "https://www.svgrepo.com/show/374109/svelte.svg",
    Vue: "https://www.svgrepo.com/show/452130/vue.svg",
    TypeScript: "https://www.svgrepo.com/show/374146/typescript-official.svg",
    "Next.js": "https://www.svgrepo.com/show/378440/nextjs-fill.svg",
    "RESTful APIs": "https://www.svgrepo.com/show/448281/api.svg",
    JAVA: "https://www.svgrepo.com/show/452234/java.svg",
    Vite: "https://www.svgrepo.com/show/374167/vite.svg",
  };

  return icons[skill] || <FiCode className={iconClass} />;
};

// Icon mapping for dynamic rendering
const iconMap = {
  Github,
  LinkedinIcon,
  FileUser,
  Moon,
};

const colors = [
  "bg-blue-100 text-blue-800 border border-blue",
  "bg-purple-100 text-purple-800 border border-purple",
  "bg-amber-100 text-amber-800 border border-amber",
  "bg-emerald-100 text-emerald-800 border border-emerald",
  "bg-rose-100 text-rose-800 border border-rose",
  "bg-indigo-100 text-indigo-800 border border-indigo",
  "bg-cyan-100 text-cyan-800 border border-cyan",
];

// Helper to extract skills from description
const extractSkills = (description) => {
  const skillsMap = {
    React: "React",
    "Tailwind CSS": "Tailwind",
    Redux: "Redux",
    JavaScript: "JavaScript",
    HTML: "HTML",
    CSS: "CSS",
    responsive: "Responsive Design",
    performance: "Performance",
    Svelte: "Svelte",
    Vue: "Vue",
    TypeScript: "TypeScript",
    "Next.js": "Next.js",
    "UI Design": "UI Design",
    "UX Design": "UX Design",
    "RESTful APIs": "RESTful APIs",
  };

  return Object.keys(skillsMap)
    .filter((key) => description.includes(key))
    .map((key) => skillsMap[key]);
};

// Color mapping for skills
const skillColors = {
  React: "bg-blue-100 text-blue-800 border border-blue",
  Tailwind: "bg-cyan-100 text-cyan-800 border border-cyan",
  Redux: "bg-purple-100 text-purple-800 border border-purple",
  JavaScript: "bg-yellow-100 text-yellow-800 border border-yellow",
  HTML: "bg-orange-100 text-orange-800 border border-orange",
  CSS: "bg-pink-100 text-pink-800 border border-pink",
  "Responsive Design": "bg-green-100 text-green-800 border border-green",
  Performance: "bg-amber-100 text-amber-800 border border-amber",
  Svelte: "bg-pink-100 text-pink-800 border border-pink",
  Vue: "bg-purple-100 text-purple-800 border border-purple",
  TypeScript: "bg-blue-100 text-blue-900 border border-blue",
  "Next.js": "bg-indigo-100 text-indigo-800 border border-indigo",
  "UI Design": "bg-teal-100 text-teal-800 border border-teal",
  "UX Design": "bg-lime-100 text-lime-800 border border-lime",
  "RESTful APIs": "bg-gray-100 text-gray-800 border border-gray",
};

const skills = [
  "React",
  "Tailwind",
  "Redux",
  "JavaScript",
  "HTML",
  "CSS",
  "Svelte",
  "Vue",
  "TypeScript",
  "Next.js",
  "JAVA",
  "Vite",
];

const App = () => {
  const { header, navbar, projects, experiences } = data;
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onLoaded={() => setIsLoading(false)} />}
      </AnimatePresence>

      <ThemeWrapper theme={theme}>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='max-md:w-full w-4/5 max-w-6xl mx-auto min-h-screen flex flex-col'
          >
            {/* Navbar with slide-in */}
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Navbar navbar={navbar} theme={theme} toggleTheme={toggleTheme} />
            </motion.div>

            {/* Header with fade-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Header header={header} iconMap={iconMap} />
            </motion.div>

            {/* Skills with staggered children */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Skills skills={skills} getSkillIcon={getSkillIcon} />
            </motion.div>

            {/* Projects with scale-up */}
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Projects projects={projects} colors={colors} />
            </motion.div>

            {/* Experience with fade-up */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <Experience
                experiences={experiences}
                extractSkills={extractSkills}
                skillColors={skillColors}
              />
            </motion.div>

            {/* Contact with fade-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <ContactUs theme={theme} />
            </motion.div>

            <Toaster position='top-right' richColors />
          </motion.div>
        )}
      </ThemeWrapper>
    </>
  );
};

export default App;
