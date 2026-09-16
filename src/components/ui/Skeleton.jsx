import React from "react";

export default function Skeleton({
  className = "",
  width,
  height,
  circle = false,
}) {
  const normalizeSize = (value) => {
    if (typeof value === "number") return `${value}px`;
    return value;
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-300 dark:bg-gray-700 ${
        circle ? "rounded-full" : "rounded-lg"
      } ${className}`}
      style={{
        width: normalizeSize(width),
        height: normalizeSize(height),
      }}
    >
      <div className="shimmer-sweep absolute inset-y-0 w-full bg-linear-to-r from-transparent via-white/30 to-transparent dark:via-white/5" />
    </div>
  );
}
