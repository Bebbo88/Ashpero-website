import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("./package.json");

// This value busts the persisted React Query cache in visitors' browsers. The
// package version alone never changes between deploys, so a catalogue cached
// before a product was removed kept being restored for up to its seven-day
// lifetime; the commit SHA moves every deploy. Falls back to the version
// locally, where a stable key is what you want.
const appVersion = process.env.VERCEL_GIT_COMMIT_SHA || version;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [50, 60, 70, 75],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
