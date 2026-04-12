const DEFAULT_QUALITY = 75;
const CLOUDINARY_HOSTNAME = "res.cloudinary.com";

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(value);
}

function toOptimizedCloudinaryUrl(src, width, quality = DEFAULT_QUALITY) {
  const uploadSeparator = "/upload/";
  const separatorIndex = src.indexOf(uploadSeparator);

  if (separatorIndex === -1) {
    return src;
  }

  const prefix = src.slice(0, separatorIndex + uploadSeparator.length);
  const suffix = src.slice(separatorIndex + uploadSeparator.length);
  const transformations = [`f_auto`, `q_${quality}`, `w_${width}`, "c_limit"].join(",");

  return `${prefix}${transformations}/${suffix}`;
}

export default function cloudinaryImageLoader({ src, width, quality }) {
  if (!src || typeof src !== "string") {
    return "";
  }

  if (!isAbsoluteUrl(src)) {
    return src;
  }

  try {
    const parsedUrl = new URL(src);

    if (parsedUrl.hostname === CLOUDINARY_HOSTNAME) {
      return toOptimizedCloudinaryUrl(src, width, quality || DEFAULT_QUALITY);
    }
  } catch (_error) {
    return src;
  }

  return src;
}
