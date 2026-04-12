/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // local
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

      // render
      {
        protocol: "https",
        hostname: "ashpero-server-3.onrender.com",
        pathname: "/uploads/**",
      },

      // ✅ أهم إضافة
      {
  protocol: "https",
  hostname: "res.cloudinary.com",
  pathname: "/**", // 🔥 دي المهمة
}

      // social
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
};

export default nextConfig;
