import { useEffect, useRef } from "react";

/**
 * Trailing cursor.
 *
 * Two fixes over the previous version:
 *
 * 1. It used mix-blend-mode: difference on a lime dot. Over the hero photo and
 *    the project thumbnails — which are themselves green — difference produced
 *    a near-identical green and the cursor visually disappeared. It now paints
 *    a solid dot with a contrasting ring, so it is legible on any backdrop.
 *
 * 2. It called React setState on every pointermove, re-rendering the tree at
 *    pointer frequency. Position is now written straight to the DOM inside one
 *    rAF loop, so movement stays smooth no matter what else is on screen.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Touch devices never show it, and the stylesheet only hides the native
    // cursor behind the same (pointer: fine) query.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...pointer };
    const ringPos = { ...pointer };
    let visible = false;
    let frame = 0;

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!visible) {
        visible = true;
        dot.classList.add("is-visible");
        ring.classList.add("is-visible");
      }
      const el = event.target instanceof Element ? event.target : null;
      ring.classList.toggle("is-active", Boolean(el && el.closest("a, button, input, textarea")));

      // The contact band is lime; a lime cursor on it would be invisible.
      const onLight = Boolean(el && el.closest(".contact-band")) && !(el && el.closest(".contact-form"));
      dot.classList.toggle("on-light", onLight);
      ring.classList.toggle("on-light", onLight);
    };

    const onLeave = () => {
      visible = false;
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
    };

    const render = () => {
      // Dot tracks tightly, ring lags behind for the trailing feel.
      dotPos.x += (pointer.x - dotPos.x) * 0.62;
      dotPos.y += (pointer.y - dotPos.y) * 0.62;
      ringPos.x += (pointer.x - ringPos.x) * 0.16;
      ringPos.y += (pointer.y - ringPos.y) * 0.16;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <span ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <span ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
