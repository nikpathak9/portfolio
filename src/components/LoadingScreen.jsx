import { useState } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen({ onLoaded }) {
  const [showName, setShowName] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <div className='relative w-screen h-screen overflow-hidden bg-white'>
      {/* Black background shrink */}
      {!loadingDone && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className='absolute top-0 right-0 h-full bg-black z-20'
          onUpdate={(latest) => {
            if (typeof latest.width === "string") {
              const val = parseFloat(latest.width);
              if (!showName && val <= 50) {
                setShowName(true);
              }
            }
          }}
          onAnimationComplete={() => {
            setLoadingDone(true);
            onLoaded?.();
          }}
        />
      )}

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{
          x: showName ? 0 : -50,
          opacity: showName ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className='absolute inset-0 flex items-center justify-center z-10'
      >
        <h1 className='text-3xl md:text-4xl font-light tracking-widest text-black'>
          NIKHIL <strong>PATHAK</strong>
        </h1>
      </motion.div>
    </div>
  );
}
