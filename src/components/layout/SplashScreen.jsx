"use client";

import React, { useState, useEffect } from "react";
import Image from "@/components/ui/AppImage";
import { motion, AnimatePresence } from "framer-motion";
import { useMode } from "@/hooks/useMode";

export default function SplashScreen({ children }) {
  const [showSplash, setShowSplash] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isDark } = useMode();

  useEffect(() => {
    setIsMounted(true);
    // Check if the splash was already shown in the current tab session
    const hasSeenSplash = sessionStorage.getItem("splash_shown");
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem("splash_shown", "true");
    setShowSplash(false);
  };

  // Prevent flash of unstyled content wait for client to mount
  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-[100] bg-bg-primary flex items-center justify-center">
        {/* Silent loading state before hydration captures the layout */}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-overlay"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary/80 dark:bg-bg-primary/80 backdrop-blur-md"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 1,
                delay: 0.1,
              }}
              className="relative flex items-center justify-center w-64 h-24 md:w-80 md:h-32"
            >
              <motion.div
                animate={{ scale: [1, 1, 15], opacity: [1, 1, 0] }}
                transition={{
                  duration: 1.6,
                  times: [0, 0.5, 1], // Waits smoothly at scale 1 before dramatically zooming in (scale 15) and fading out
                  ease: [0.4, 0, 0.2, 1],
                  delay: 1.2, // starts zooming out after the drop is completed
                }}
                onAnimationComplete={handleAnimationComplete}
                className="w-full h-full relative"
              >
                <Image
                  src={isDark ? "/assets/logo white.svg" : "/assets/logo.svg"}
                  alt="Ashpero Logo"
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render app content behind the splash. Disable scrolling while splash is active. */}
      <div className={showSplash ? "h-screen w-full overflow-hidden" : ""}>
        {children}
      </div>
    </>
  );
}



