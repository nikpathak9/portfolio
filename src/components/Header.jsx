import { ArrowUpRight } from "lucide-react";
import { motion as Motion } from "framer-motion";
import Magnetic from "./Magnetic";

const HEADLINE = ["I build calm,", "useful interfaces", "for people who", "notice the details."];

/* Each line is masked and slides up from below — the mask is why the words
   appear to rise out of nothing rather than just fading in. */
const lineVariants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
};

export default function Header({ profile }) {
  return (
    <section id="top" className="hero section-band">
      <div className="page-shell hero-content">
        <Motion.div
          className="hero-copy"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
        >
          <Motion.p
            className="eyebrow"
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          >
            Frontend engineer · 04 years
          </Motion.p>

          <h1>
            {HEADLINE.map((line) => (
              <span className="headline-line" key={line}>
                <Motion.span className="headline-inner" variants={lineVariants}>
                  {line}
                </Motion.span>
              </span>
            ))}
          </h1>

          <Motion.p
            className="hero-description"
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          >
            {profile.description}
          </Motion.p>

          <Motion.div
            className="hero-actions"
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          >
            <Magnetic>
              <a className="button button-primary" href="#contact">
                Let’s work together <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                className="button button-secondary"
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                Résumé <ArrowUpRight size={14} />
              </a>
            </Magnetic>
          </Motion.div>
        </Motion.div>

        <Motion.figure
          className="hero-portrait"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={profile.image} alt={profile.name} loading="eager" />
          <span className="hero-portrait-sheen" aria-hidden="true" />
        </Motion.figure>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="hero-scroll-mouse">
          <i />
        </span>
        <span>Scroll</span>
      </div>
    </section>
  );
}
