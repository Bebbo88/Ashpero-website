import NextImage from "next/image";

function isRemoteUrl(src) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

export default function AppImage({ src, unoptimized, ...props }) {
  const shouldBypassOptimizer =
    typeof unoptimized === "boolean" ? unoptimized : isRemoteUrl(src);

  return <NextImage src={src} unoptimized={shouldBypassOptimizer} {...props} />;
}
