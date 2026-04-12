import { toAbsoluteAssetUrl } from "@/constants/config";
import { apiClient } from "@/services/http/axiosClient";

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

function mapTipContainer(tip, locale = "en", index = 0) {
  const id = String(tip?._id || tip?.id || `tip-${index + 1}`);

  const container = {
    id,
    video: {
      src: toAbsoluteAssetUrl(tip?.videoUrl || ""),
      title: getLocalizedValue(tip, locale, "videoTitle_en", "videoTitle_ar", "videoTitle")
    },
    cards: [
      {
        id: `${id}-primary`,
        image: toAbsoluteAssetUrl(tip?.primaryImage || ""),
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
        image: toAbsoluteAssetUrl(tip?.secondaryImage || ""),
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
  if (!container?.video?.src) {
    return false;
  }

  if (!Array.isArray(container.cards) || container.cards.length !== 2) {
    return false;
  }

  return container.cards.every((card) => Boolean(card?.image));
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
