"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Skeleton({ className = "", width, height, circle = false }) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-muted dark:bg-white/5 ${
        circle ? "rounded-full" : "rounded-lg"
      } ${className}`}
      style={{ width, height }}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5"
      />
    </div>
  );
}
