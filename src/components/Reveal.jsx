import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll using a plain IntersectionObserver.
 *
 * Deliberately not framer-motion's `whileInView`: that left elements stuck at
 * opacity 0 when several siblings entered the viewport in the same frame.
 * Here the element is only hidden once the observer is confirmed to be
 * running, so content can never end up permanently invisible.
 */
export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return undefined;
    }

    setIsArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(element);

    // Safety net: if the observer never fires (odd layouts, print, headless
    // capture), show the content anyway rather than leaving a blank section.
    const fallback = window.setTimeout(() => setIsVisible(true), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={elementRef}
      className={`reveal ${isArmed && !isVisible ? "is-hidden" : "is-visible"} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
