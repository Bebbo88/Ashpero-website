import NextImage from "next/image";

function isValidSrc(src) {
  return typeof src === "string" && src.trim().length > 0;
}

// Custom loader to offload image optimization to Cloudinary
const cloudinaryLoader = ({ src, width, quality }) => {
  const urlParts = src.split("/upload/");
  if (urlParts.length === 2) {
    // Inject Cloudinary transformations: width, quality, and auto-format (WebP/AVIF)
    return `${urlParts[0]}/upload/w_${width},q_${quality || "auto"},f_auto/${urlParts[1]}`;
  }
  return src;
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
