import { useEffect, useRef } from "react";

export default function SectionAtmosphere({ variant }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    const updatePosition = () => {
      const bounds = element.parentElement.getBoundingClientRect();
      element.style.setProperty("--section-shift", `${Math.max(-70, Math.min(70, -bounds.top * 0.09))}px`);
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return <span ref={elementRef} className={`section-atmosphere atmosphere-${variant}`} aria-hidden="true" />;
}
