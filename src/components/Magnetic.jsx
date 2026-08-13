import { useRef } from "react";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * Transforms are written straight to the node so this costs no re-renders.
 */
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const x = event.clientX - (b.left + b.width / 2);
    const y = event.clientY - (b.top + b.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </span>
  );
}
