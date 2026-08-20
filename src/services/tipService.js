import { toAbsoluteAssetUrl } from "@/constants/config";
import { apiClient } from "@/services/http/axiosClient";

const CLOUDINARY_HOST = "res.cloudinary.com";
const CLOUDINARY_UPLOAD_SEPARATOR = "/upload/";

function unwrapApiResponse(response) {
  return response?.data?.data ?? null;
}

function getLocalizedValue(entity, locale, englishKey, arabicKey, fallbackKey) {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  if (locale === "ar") {
    return entity[arabicKey] || entity[englishKey] || entity[fallbackKey] || "";
  }

  return entity[englishKey] || entity[arabicKey] || entity[fallbackKey] || "";
}

function injectCloudinaryTransformations(url, transformations) {
  if (typeof url !== "string" || !url) {
    return "";
  }

  if (!url.includes(CLOUDINARY_UPLOAD_SEPARATOR)) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname !== CLOUDINARY_HOST) {
      return url;
    }

    const [prefix, suffix] = url.split(CLOUDINARY_UPLOAD_SEPARATOR);
    if (!prefix || !suffix) {
      return url;
    }

    const firstSegment = suffix.split("/")[0];
    if (!/^v\d+$/.test(firstSegment)) {
      // A transformation already exists. Keep the original URL.
      return url;
    }

    return `${prefix}${CLOUDINARY_UPLOAD_SEPARATOR}${transformations}/${suffix}`;
  } catch (_error) {
    return url;
  }
}

function toOptimizedCloudinaryVideoUrl(url) {
  if (!url || typeof url !== "string") return "";
  // If the media is an image (jpg, png, webp, /image/upload/), don't inject video-specific codec transformations
  if (/\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i.test(url) || url.includes("/image/upload/")) {
    return url;
  }
  return injectCloudinaryTransformations(url, "f_auto,q_auto:good,vc_auto,br_auto");
}

function toOptimizedCloudinaryPosterUrl(url) {
  if (!url || typeof url !== "string") return "";
  return url;
}

function mapTipContainer(tip, locale = "en", index = 0) {
  const id = String(tip?._id || tip?.id || `tip-${index + 1}`);
  const rawVideoUrl = toAbsoluteAssetUrl(tip?.videoUrl || "");
  const primaryImageUrl = toAbsoluteAssetUrl(tip?.primaryImage || "");
  const secondaryImageUrl = toAbsoluteAssetUrl(tip?.secondaryImage || "");

  const container = {
    id,
    video: {
      src: toOptimizedCloudinaryVideoUrl(rawVideoUrl),
      poster: toOptimizedCloudinaryPosterUrl(primaryImageUrl),
      title: getLocalizedValue(tip, locale, "videoTitle_en", "videoTitle_ar", "videoTitle")
    },
    cards: [
      {
        id: `${id}-primary`,
        image: primaryImageUrl,
        title: getLocalizedValue(tip, locale, "primaryTitle_en", "primaryTitle_ar", "primaryTitle"),
        description: getLocalizedValue(
          tip,
          locale,
          "primaryDescription_en",
          "primaryDescription_ar",
          "primaryDescription"
        )
      },
      {
        id: `${id}-secondary`,
        image: secondaryImageUrl,
        title: getLocalizedValue(
          tip,
          locale,
          "secondaryTitle_en",
          "secondaryTitle_ar",
          "secondaryTitle"
        ),
        description: getLocalizedValue(
          tip,
          locale,
          "secondaryDescription_en",
          "secondaryDescription_ar",
          "secondaryDescription"
        )
      }
    ]
  };

  return container;
}

function isRenderableTipContainer(container) {
  // Relaxed: As long as there is a video OR at least one image, show it.
  const hasVideo = Boolean(container?.video?.src);
  const hasImages = Array.isArray(container.cards) && container.cards.some(c => Boolean(c?.image));
  
  return hasVideo || hasImages;
}

export async function fetchTips(locale = "en") {
  const response = await apiClient.get("/tips");
  const data = unwrapApiResponse(response);

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((tip, index) => mapTipContainer(tip, locale, index))
    .filter(isRenderableTipContainer);
}

export const tipService = {
  fetchTips
};
