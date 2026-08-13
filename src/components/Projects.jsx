import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

function ProjectCard({ project, index }) {
  const ref = useRef(null);

  /* Pointer-tracked tilt + a spotlight that follows the cursor across the card. */
  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const px = (event.clientX - b.left) / b.width - 0.5;
    const py = (event.clientY - b.top) / b.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) translateY(-6px)`;
    el.style.setProperty("--spot-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--spot-y", `${(py + 0.5) * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <Reveal className="project-shell" delay={index * 0.09}>
      <article
        ref={ref}
        className="project"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <span className="project-spot" aria-hidden="true" />
        <a
          className="project-image"
          href={project.preview}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${project.title}`}
        >
          <img
            src={project.image}
            alt={`${project.title} interface`}
            loading={index === 0 ? "eager" : "lazy"}
          />
          <span className="project-open">
            Open live build <ArrowUpRight size={13} />
          </span>
        </a>
        <div className="project-details">
          <p className="project-number">0{index + 1}</p>
          <h3>{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <p className="project-meta">{project.tags.slice(0, 2).join(" · ")}</p>
          <a
            className="project-link"
            href={project.preview}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title}`}
          >
            <ArrowUpRight size={14} />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section-band projects-band">
      <div className="page-shell section projects-section">
        <Reveal className="section-heading split-heading">
          <h2>Selected work</h2>
          <p className="section-note">Three recent systems and interfaces</p>
        </Reveal>

        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
