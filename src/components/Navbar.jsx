import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function Navbar({ items, profile, contact }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Lock the page behind the overlay, restore the exact scroll position after.
  useEffect(() => {
    if (!isOpen) return undefined;
    const y = window.scrollY;
    const { style } = document.body;
    const prev = { position: style.position, top: style.top, width: style.width };
    style.position = "fixed";
    style.top = `-${y}px`;
    style.width = "100%";

    const onKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
      // Simple focus trap so tabbing can't wander behind the overlay.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll("a, button");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      window.scrollTo(0, y);
    };
  }, [isOpen]);

  const social = (profile?.links || []).filter((link) => link.label !== "Email");

  return (
    <>
      <header className="site-header">
      <nav className="nav page-shell" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Nikhil Pathak home">
          Nikhil Pathak
        </a>

        <button
          ref={buttonRef}
          className={`menu-button ${isOpen ? "is-open" : ""}`}
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="menu-bar" />
          <span className="menu-bar" />
        </button>

        <div className="nav-links">
          {items.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <p className="nav-availability">
          <i />
          Available for select work
        </p>
      </nav>
      </header>

      {/* Rendered as a sibling of <header>, not inside it: .site-header has
          backdrop-filter, which would make it the containing block for this
          fixed element and trap it behind the 58px bar. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`mobile-menu ${isOpen ? "is-open" : ""}`}
        hidden={!isOpen}
      >
        <ul className="mobile-menu-list">
          {items.map((item, index) => (
            <li key={item.href} style={{ "--i": index }}>
              <a href={item.href} onClick={() => setIsOpen(false)}>
                <span className="mobile-menu-index">0{index + 1}</span>
                <span className="mobile-menu-label">{item.label}</span>
                <ArrowUpRight className="mobile-menu-arrow" size={20} />
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-foot" style={{ "--i": items.length }}>
          <a className="mobile-menu-mail" href={`mailto:${contact?.email}`}>
            {contact?.email}
          </a>
          <div className="mobile-menu-social">
            {social.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
            {profile?.resume ? (
              <a href={profile.resume} target="_blank" rel="noreferrer">
                Résumé
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
