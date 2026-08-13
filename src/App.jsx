import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import data from "./data/data.json";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import ContactUs from "./components/ContactUs";
import ThemeToggle from "./components/ThemeToggle";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";
import FluidBackground from "./components/FluidBackground";
import Skills from "./components/Skills";

export default function App() {
  // Dark is the default: only an explicit, previously-chosen "light" opts out.
  // index.html also ships data-theme="dark" so the first paint is never light.
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <main>
      <a className="skip-link" href="#projects">Skip to content</a>
      <LoadingScreen isVisible={isLoading} />
      <ScrollProgress />
      <FluidBackground />
      <Navbar items={data.navigation} profile={data.profile} contact={data.contact} />
      <Header profile={data.profile} />
      <Projects projects={data.projects} />
      <Skills groups={data.skills} />
      <Experience experiences={data.experiences} />
      <ContactUs contact={data.contact} profile={data.profile} themeToggle={<ThemeToggle theme={theme} onToggle={toggleTheme} />} />
      <CustomCursor />
      <Toaster position="top-right" richColors />
    </main>
  );
}
