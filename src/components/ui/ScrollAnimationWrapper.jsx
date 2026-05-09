"use client";

import { motion } from "framer-motion";

const variants = {
  "fade-up": {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-from-right": {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  "slide-from-left": {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  "scale-up": {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  "zoom-in": {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
  }
};

export default function ScrollAnimationWrapper({ 
  children, 
  className = "",
  animation = "fade-up",
  mode = "scroll", // "scroll" | "load"
  delay = 0
}) {
  const selectedVariant = variants[animation] || variants["fade-up"];

  if (mode === "load") {
    return (
      <motion.div
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={selectedVariant.initial}
      whileInView={selectedVariant.animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
