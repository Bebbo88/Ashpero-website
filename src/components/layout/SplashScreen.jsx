"use client";

import React, { useState, useEffect } from "react";
import Image from "@/components/ui/AppImage";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ children, hasSeenSplash }) {
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  useEffect(() => {
    // Check if the splash was already shown in the current tab session
    const hasSeenSplashSession = sessionStorage.getItem("splash_shown");
    if (hasSeenSplashSession && showSplash) {
      setShowSplash(false);
    }
  }, [showSplash]);

  const handleAnimationComplete = () => {
    document.cookie = "splash_shown=true; path=/";
    sessionStorage.setItem("splash_shown", "true");
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-overlay"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-primary/80 dark:bg-bg-primary/80 backdrop-blur-md"
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
                  duration: 2.4,
                  times: [0, 0.7, 1],
                  ease: [0.4, 0, 0.2, 1],
                  delay: 1.2,
                }}
                onAnimationComplete={handleAnimationComplete}
                className="w-full h-full relative"
              >
                <div className="w-full h-full relative block dark:hidden">
                  <Image
                    src="/assets/logo.svg"
                    alt="Ashpero Logo"
                    fill
                    sizes="(max-width: 768px) 256px, 320px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="w-full h-full relative hidden dark:block">
                  <Image
                    src="/assets/logo-white.svg"
                    alt="Ashpero Logo"
                    fill
                    sizes="(max-width: 768px) 256px, 320px"
                    className="object-contain"
                    priority
                  />
                </div>
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
