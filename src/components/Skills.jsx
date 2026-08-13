import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
/* Icon names are pinned to react-icons 5.5.0 (see package.json — exact, not
   caret). 5.7.0 renamed SiCss3 to SiCss, so an unpinned range silently breaks
   this import on a fresh install. */
import {
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiRedux,
  SiSolid,
  SiTailwindcss,
  SiTypescript,
  SiLightning,
  SiGraphql,
  SiFramer,
} from "react-icons/si";

const ICONS = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss3,
  "Tailwind CSS": SiTailwindcss,
  Redux: SiRedux,
  SolidJS: SiSolid,
  LightningJS: SiLightning,
  GraphQL: SiGraphql,
  "Framer Motion": SiFramer,
};

/** Card that tilts toward the pointer. Writes transforms directly — no state. */
function SkillCard({ label }) {
  const ref = useRef(null);
  const Icon = ICONS[label];

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const px = (event.clientX - b.left) / b.width - 0.5;
    const py = (event.clientY - b.top) / b.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-py * 14}deg) rotateY(${
      px * 14
    }deg) translateZ(6px)`;
    el.style.setProperty("--glow-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--glow-y", `${(py + 0.5) * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <li
      ref={ref}
      className='skill-card'
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className='skill-card-glow' aria-hidden='true' />
      {Icon ? (
        <Icon className='skill-card-icon' aria-hidden='true' />
      ) : (
        <span className='skill-card-mono'>{label.slice(0, 2)}</span>
      )}
      <span className='skill-card-label'>{label}</span>
    </li>
  );
}

/**
 * Marquee that sizes itself.
 *
 * A fixed two-copy track animated to -50% only loops seamlessly while one copy
 * is wider than the container. On a wide display — or in the window before the
 * webfont swaps in and text reflows — a copy can be narrower, and the tail of
 * the loop shows as empty space until it resets. So the copy count is derived
 * from the measured widths, re-measured after fonts load and on resize, and the
 * animation travels exactly one copy width rather than a fixed percentage.
 */
function useMarquee(itemCount) {
  const wrapRef = useRef(null);
  const groupRef = useRef(null);
  const [copies, setCopies] = useState(2);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const group = groupRef.current;
    if (!wrap || !group) return undefined;

    const measure = () => {
      const groupW = group.getBoundingClientRect().width;
      const wrapW = wrap.getBoundingClientRect().width;
      if (!groupW || !wrapW) return;
      // Enough copies that the track always overhangs the container.
      setCopies(Math.max(2, Math.ceil(wrapW / groupW) + 1));
      setDistance(groupW);
    };

    measure();
    // Webfonts change text metrics after first paint.
    document.fonts?.ready.then(measure).catch(() => {});
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    observer.observe(group);
    return () => observer.disconnect();
  }, [itemCount]);

  return { wrapRef, groupRef, copies, distance };
}

export default function Skills({ groups }) {
  const marquee = groups.flatMap((group) => group.items);
  const { wrapRef, groupRef, copies, distance } = useMarquee(marquee.length);
  // Constant scroll speed regardless of how much content there is.
  const duration = distance ? distance / 55 : 30;

  return (
    <section id='skills' className='section-band skills-band'>
      <div className='page-shell section skills-section'>
        <Reveal className='section-heading split-heading'>
          <h2>Capabilities</h2>
          <p className='section-note'>The toolkit, and how it fits together</p>
        </Reveal>

        <div className='skill-groups'>
          {groups.map((group, index) => (
            <Reveal
              className='skill-group'
              key={group.label}
              delay={index * 0.08}
            >
              <p className='skill-group-label'>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {group.label}
              </p>
              <ul className='skill-cards'>
                {group.items.map((item) => (
                  <SkillCard key={item} label={item} />
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Edge-to-edge marquee — deliberately outside .page-shell so it bleeds. */}
      <div className='skill-marquee' ref={wrapRef} aria-hidden='true'>
        <div
          className='skill-marquee-track'
          style={{
            "--marquee-distance": `${distance}px`,
            "--marquee-duration": `${duration}s`,
          }}
        >
          {Array.from({ length: copies }, (_, copy) => (
            <span
              className='skill-marquee-group'
              key={copy}
              ref={copy === 0 ? groupRef : undefined}
            >
              {marquee.map((item) => (
                <span className='skill-marquee-item' key={`${copy}-${item}`}>
                  {item}
                  <i />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
