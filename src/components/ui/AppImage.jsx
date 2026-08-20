import NextImage from "next/image";

function isValidSrc(src) {
  return typeof src === "string" && src.trim().length > 0;
}

// Custom loader to offload image optimization to Cloudinary
const cloudinaryLoader = ({ src, width, quality }) => {
  if (typeof src !== "string" || !src.includes("/upload/")) {
    return src;
  }
  const [prefix, suffix] = src.split("/upload/");
  if (!prefix || !suffix) {
    return src;
  }

  // If suffix already has transformations, clean them safely without touching version (v123...)
  const cleanSuffix = suffix.replace(/^(?:[a-z0-9_:,]+,?)+\/(?!v\d+)/i, "");

  return `${prefix}/upload/w_${width},q_${quality || "auto"},f_auto/${cleanSuffix}`;
};

export default function AppImage({ src, unoptimized = false, ...props }) {
  if (!isValidSrc(src)) {
    return null; // أو skeleton
  }

  // Check if the image is from Cloudinary
  const isCloudinary = typeof src === "string" && src.includes("res.cloudinary.com");

  return (
    <NextImage
      src={src}
      unoptimized={unoptimized}
      loader={isCloudinary ? cloudinaryLoader : undefined}
      {...props}
    />
  );
}
