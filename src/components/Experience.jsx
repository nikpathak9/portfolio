import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import wbdLogo from "../assets/wbd.png";
import outlierLogo from "../assets/outlier.png";
import zeeLogo from "../assets/zee.png";

const companyLogos = {
  "wbd.png": wbdLogo,
  "outlier.png": outlierLogo,
  "zee.png": zeeLogo,
};

/* White chip so brand colours read correctly on the dark card, and so logos
   that ship with a white background (rather than transparency) still look
   deliberate. Falls back to a monogram if the file is missing. */
function CompanyLogo({ experience }) {
  const [failed, setFailed] = useState(false);
  const logo = companyLogos[experience.logo] || experience.logo;
  const showImage = logo && !failed;

  return (
    <span className="experience-logo" aria-hidden="true">
      {showImage ? (
        <img
          src={logo}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="experience-logo-fallback">
          {experience.initials || experience.company.slice(0, 1)}
        </span>
      )}
    </span>
  );
}

function ExperienceCard({ experience, isActive, isCurrent }) {
  const ref = useRef(null);

  /* Cursor-tracked spotlight, matching the project and skill cards. */
  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((event.clientX - b.left) / b.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((event.clientY - b.top) / b.height) * 100}%`);
  };

  return (
    <div
      ref={ref}
      className={`experience-card ${isActive ? "is-active" : ""}`}
      onPointerMove={onMove}
    >
      <span className="experience-spot" aria-hidden="true" />

      <div className="experience-card-top">
        <CompanyLogo experience={experience} />
        {isCurrent ? (
          <span className="experience-badge">
            <i />
            Current
          </span>
        ) : null}
      </div>

      <p className="experience-period">{experience.period}</p>
      <h3>{experience.role}</h3>
      <p className="experience-company">{experience.company}</p>
      <p className="experience-summary">{experience.summary}</p>

      <span className="experience-rule" aria-hidden="true" />
      <span className="experience-corner" aria-hidden="true">
        <ArrowUpRight size={14} />
      </span>
    </div>
  );
}

export default function Experience({ experiences }) {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeExperience, setActiveExperience] = useState(0);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const span = rect.height - window.innerHeight * 0.25;
      if (span <= 0) return;
      const ratio = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - rect.top) / span));
      setProgress(ratio * 100);
      setActiveExperience(
        Math.min(experiences.length - 1, Math.max(0, Math.round(ratio * (experiences.length - 1))))
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [experiences.length]);

  return (
    <section ref={sectionRef} id="experience" className="section-band experience-band">
      <div className="page-shell section experience-section">
        <Reveal className="section-heading split-heading">
          <h2>Experience</h2>
          <p className="section-note">Product thinking, built in code</p>
        </Reveal>

        <div className="experience-list" style={{ "--timeline-progress": `${progress}%` }}>
          <span className="experience-rail" aria-hidden="true">
            <i />
          </span>

          {experiences.map((experience, index) => (
            <Reveal
              className={`experience experience-${index % 2 === 0 ? "left" : "right"}`}
              key={`${experience.company}-${experience.role}`}
              delay={index * 0.06}
            >
              <ExperienceCard
                experience={experience}
                isActive={index === activeExperience}
                isCurrent={index === 0}
              />
              <div className="experience-axis" aria-hidden="true">
                <span className={`experience-node ${index <= activeExperience ? "is-reached" : ""}`}>
                  0{index + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
