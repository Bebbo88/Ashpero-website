import NextImage from "next/image";

function isRemoteUrl(src) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

export default function AppImage({ src, unoptimized = false, ...props }) {
  return <NextImage src={src} unoptimized={unoptimized} {...props} />;
}
