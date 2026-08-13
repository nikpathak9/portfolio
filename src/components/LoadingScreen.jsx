import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";

const NAME = "Nikhil Pathak";

/**
 * Launch screen: a counter running to 100, the name revealing letter by letter
 * from behind a mask, and a progress rule that fills. On exit the whole panel
 * wipes upward via clip-path rather than fading, so it reads as a curtain
 * lifting off the hero underneath.
 */
export default function LoadingScreen({ isVisible, duration = 1250 }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!isVisible) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPercent(100);
      return undefined;
    }

    let frame = 0;
    let start = 0;
    const step = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      // Ease-out so the count decelerates into 100 instead of ending abruptly.
      setPercent(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          className='loader'
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          aria-label='Loading'
          role='status'
        >
          <div className='loader-inner'>
            <p className='loader-tag'>Portfolio · 2026</p>

            <h1 className='loader-name' aria-label={NAME}>
              {NAME.split("").map((char, index) => (
                <span className='loader-char' key={`${char}-${index}`}>
                  <Motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.06 + index * 0.022,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {char === " " ? " " : char}
                  </Motion.span>
                </span>
              ))}
            </h1>

            <div className='loader-foot'>
              <span className='loader-role'>Frontend Engineer</span>
              <span className='loader-count'>
                {String(percent).padStart(3, "0")}
                <i>%</i>
              </span>
            </div>

            <div className='loader-rule'>
              <i style={{ transform: `scaleX(${percent / 100})` }} />
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
