import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { toast } from "sonner";

/* EmailJS credentials. The public key is a client-side identifier by design —
   it is visible in the network tab of any deployed site — so the real
   protection is the domain allowlist in the EmailJS dashboard, not secrecy.
   Values can still be overridden per-environment via .env (see .env.example). */
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_5glwr3n";
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_eg6undi";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "GqAD5bXUaQlhweSnD";

export default function ContactUs({ contact, profile, themeToggle }) {
  const formRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  /* Field names below (from_name / from_email / message / time) must match the
     existing EmailJS template — renaming them silently breaks delivery. */
  const sendEmail = (event) => {
    event.preventDefault();
    if (isSending) return;

    setIsSending(true);
    const toastId = toast.loading("Sending message…");

    emailjs
      .sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
        toast.success("Message sent — I’ll get back to you soon.", { id: toastId });
        formRef.current.reset();
      })
      .catch((error) => {
        // Surface what EmailJS actually said. Delivery failures are usually
        // account-side (e.g. "Gmail_API: Invalid grant" = the linked Gmail
        // account needs re-authorising in the EmailJS dashboard), and a
        // generic message makes that impossible to diagnose from the UI.
        const reason = error?.text || error?.message || "Unknown error";
        console.error("[contact] EmailJS send failed:", reason, error);
        toast.error(`Couldn’t send — ${reason}. Email me directly instead.`, {
          id: toastId,
          duration: 8000,
        });
      })
      .finally(() => setIsSending(false));
  };

  const social = (profile?.links || []).filter((link) => link.label !== "Email");
  const socialIcon = { GitHub: Github, LinkedIn: Linkedin };

  return (
    <footer id="contact" className="contact-band">
      <div className="page-shell contact">
        <div className="contact-lead">
          <p className="contact-eyebrow">How I work</p>
          <h2>Design systems · React · TypeScript · motion · accessibility · performance</h2>

          <div className="contact-links">
            {social.map((link) => {
              const Icon = socialIcon[link.label];
              return (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {Icon ? <Icon size={15} /> : null}
                  {link.label}
                </a>
              );
            })}
            {profile?.resume ? (
              <a href={profile.resume} target="_blank" rel="noreferrer">
                Résumé <ArrowUpRight size={14} />
              </a>
            ) : null}
          </div>
        </div>

        <div className="contact-copy">
          <p className="contact-eyebrow">Let’s make it useful</p>
          <p className="contact-line">
            I’m always interested in teams that care about the work beneath the pixels.
          </p>
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email} <ArrowUpRight size={13} />
          </a>
        </div>

        <form className="contact-form" ref={formRef} onSubmit={sendEmail}>
          <input type="hidden" name="time" value={new Date().toLocaleString()} readOnly />
          <label>
            Name
            <input name="from_name" required placeholder="Your name" autoComplete="name" />
          </label>
          <label>
            Email
            <input
              name="from_email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label>
            Project details
            <textarea name="message" required placeholder="Tell me what you’re building…" rows="4" />
          </label>
          <button type="submit" disabled={isSending}>
            {isSending ? "Sending…" : "Send message"}
            {isSending ? null : <ArrowUpRight size={13} />}
          </button>
        </form>

        <div className="contact-bottom">
          <p>© {new Date().getFullYear()} Nikhil Pathak</p>
          <p className="contact-place">{contact.location}</p>
          {themeToggle}
        </div>
      </div>
    </footer>
  );
}
