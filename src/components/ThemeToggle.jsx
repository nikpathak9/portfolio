import { Moon, Sun } from "lucide-react";

/**
 * Real switch rather than a label that swaps text.
 *
 * It lives on the lime contact band in both themes, so its colours are keyed to
 * that band (dark track, lime knob) instead of --ink/--paper. The previous
 * version hardcoded a near-black background and used var(--ink) for the label,
 * which in light theme meant near-black text on a near-black pill.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span className="theme-toggle-label">{isDark ? "Dark" : "Light"}</span>
      <span className={`theme-toggle-track ${isDark ? "is-dark" : "is-light"}`} aria-hidden="true">
        <Sun size={11} className="theme-toggle-icon icon-sun" />
        <Moon size={11} className="theme-toggle-icon icon-moon" />
        <span className="theme-toggle-knob" />
      </span>
    </button>
  );
}
