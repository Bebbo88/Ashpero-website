import NextImage from "next/image";

function isValidSrc(src) {
  return typeof src === "string" && src.trim().length > 0;
}

export default function AppImage({ src, unoptimized = false, ...props }) {
  if (!isValidSrc(src)) {
    return null; // أو skeleton
  }

  return <NextImage src={src} unoptimized={unoptimized} {...props} />;
}
