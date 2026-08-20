"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import { motion } from "framer-motion";

export default function Loader({
  size = "md", // مش مستخدم بس سيبه زي ما هو
  fullScreen = false,
}) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg-primary"
          : "flex flex-col items-center justify-center"
      }
    >
      {/* Increased size by scaling everything up (1.5x) */}
      <div className="relative flex flex-col items-center h-48 w-32 scale-150">
        {/* Dropper */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 z-30 w-8 h-16 origin-bottom pb-1"
        >
          <Image
            src="/assets/dropper.svg"
            alt="Loading dropper"
            fill
            sizes="32px"
            unoptimized
            className="object-contain object-bottom"
            priority
          />
        </motion.div>

        {/* Falling Liquid Drop */}
        <motion.div
          animate={{
            y: [20, 80],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeIn",
            delay: 1.25,
          }}
          className="absolute top-12 z-20 w-2 h-3 bg-brand-mint loading-drop-shape"
        />

        {/* Bottle Neck & Cap Base */}
        <div className="absolute bottom-24 z-20 flex flex-col items-center">
          <div className="w-6 h-1.5 bg-white/60 dark:bg-white/20 border border-white/70 rounded-full shadow-sm mb-[-2px] z-30"></div>
          <div className="w-5 h-4 bg-white/30 dark:bg-white/10 backdrop-blur-sm border-x border-white/50 loading-neck-shadow z-20"></div>
        </div>

        {/* Bottle */}
        <div className="absolute bottom-0 z-40 w-16 h-24 bg-white/20 dark:bg-white/5 backdrop-blur-md border-[1.5px] border-white/50 dark:border-white/20 rounded-b-[1.25rem] rounded-t-2xl overflow-hidden loading-bottle-shadow flex flex-col justify-end">
          {/* Highlights */}
          <div className="absolute top-1 right-1.5 w-[3px] h-[90%] bg-gradient-to-b from-white/70 to-transparent rounded-full opacity-60 pointer-events-none z-50 mix-blend-overlay"></div>
          <div className="absolute top-2 left-1.5 w-1 h-[60%] bg-gradient-to-b from-white/50 to-transparent rounded-full opacity-40 pointer-events-none z-50 mix-blend-overlay"></div>
          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/40 to-transparent opacity-50 z-50"></div>

          {/* Liquid */}
          <div className="relative w-full h-[65%] mt-auto z-10 transition-all">
            {/* Wave 1 */}
            <motion.div
              animate={{
                y: [2, -3, 2],
                rotate: [0, 360],
              }}
              transition={{
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.0,
                },
                rotate: { duration: 3.5, repeat: Infinity, ease: "linear" },
              }}
              className="absolute top-[-30%] left-[-50%] w-[200%] h-[200%] bg-brand-mint/40 dark:bg-brand-mint/60 mix-blend-multiply dark:mix-blend-screen"
              style={{
                borderRadius: "40%",
              }}
            />

            {/* Wave 2 */}
            <motion.div
              animate={{
                y: [5, 0, 5],
                rotate: [360, 0],
              }}
              transition={{
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.0,
                },
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
              }}
              className="absolute top-[-15%] left-[-50%] w-[200%] h-[200%] bg-brand-mint/30 dark:bg-brand-mint/50 mix-blend-normal"
              style={{
                borderRadius: "45%",
              }}
            />
          </div>
        </div>

        {/* Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.0,
          }}
          className="absolute bottom-6 z-10 w-8 h-4 bg-brand-mint blur-md rounded-full pointer-events-none"
        />
      </div>
    </div>
  );
}
