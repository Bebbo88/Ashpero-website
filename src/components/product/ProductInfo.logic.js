import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";

function parseBulletPoints(content) {
  if (!content || typeof content !== "string") {
    return [];
  }

  return content
    .split(/\r?\n|[;]|,/g)
    .map((item) => item.replace(/^[-*\u2022]\s*/, "").trim())
    .filter(Boolean);
}

export function useProductInfoLogic(product) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items || []);

  const [productShareUrl, setProductShareUrl] = useState("");
  const [shareToast, setShareToast] = useState({
    visible: false,
    message: "",
  });

  const sizeOptions = useMemo(
    () =>
      Array.isArray(product.sizes)
        ? product.sizes.map((size) => String(size).trim()).filter(Boolean)
        : [],
    [product.sizes],
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [openAccordion, setOpenAccordion] = useState("ingredients");

  const decrementQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const incrementQty = () => setQuantity((prev) => Math.min(10, prev + 1));

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const resolvedSelectedSize =
    selectedSize && sizeOptions.includes(selectedSize)
      ? selectedSize
      : (sizeOptions[0] || "");

  const isWishlisted = useMemo(
    () => wishlistItems.some((item) => item.productId === String(product.id || "")),
    [product.id, wishlistItems],
  );

  const displayPrice = useMemo(() => {
    if (resolvedSelectedSize && Array.isArray(product.sizePrices)) {
      const match = product.sizePrices.find(
        (entry) => String(entry.size || "").trim() === resolvedSelectedSize,
      );

      if (match?.priceLabel) {
        return match.priceLabel;
      }
    }

    return product.price;
  }, [product.price, product.sizePrices, resolvedSelectedSize]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setProductShareUrl(window.location.href);
  }, [product.id]);

  const shareLinks = useMemo(() => {
    return {
      facebook: "https://www.messenger.com/new",
      x: "https://x.com/messages/compose",
      instagram: "https://www.instagram.com/direct/new/",
      tiktok: "https://www.tiktok.com/messages",
    };
  }, []);

  const showShareToast = (message) => {
    setShareToast({ visible: true, message });
  };

  const handleShareClick = async () => {
    if (!productShareUrl) {
      return;
    }

    const copiedMessage = "Product link copied";

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      showShareToast(copiedMessage);
      return;
    }

    try {
      await navigator.clipboard.writeText(productShareUrl);
      showShareToast(copiedMessage);
    } catch (_error) {
      showShareToast("Could not copy automatically");
    }
  };

  const resolvedPriceValue = useMemo(() => {
    if (resolvedSelectedSize && Array.isArray(product.sizePrices)) {
      const match = product.sizePrices.find(
        (entry) => String(entry.size || "").trim() === resolvedSelectedSize,
      );

      if (Number.isFinite(Number(match?.priceValue))) {
        return Number(match.priceValue);
      }
    }

    const fallback = Number(product.priceValue);
    return Number.isFinite(fallback) ? fallback : 0;
  }, [product.priceValue, product.sizePrices, resolvedSelectedSize]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.images?.[0] || "/assets/photo1.jpeg",
        category: product.category,
        price: displayPrice,
        priceValue: resolvedPriceValue,
        size: resolvedSelectedSize || "",
        quantity,
      }),
    );
  };

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlistItem({
        id: product.id,
        title: product.title,
        image: product.images?.[0] || "/assets/photo1.jpeg",
        category: product.category,
        price: displayPrice,
        priceValue: resolvedPriceValue,
      }),
    );
  };

  useEffect(() => {
    if (!shareToast.visible) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShareToast((prev) => ({ ...prev, visible: false }));
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [shareToast.visible]);

  const accordions = useMemo(
    () => [
      {
        key: "ingredients",
        title: t("ProductDetails.ingredients"),
        content: product.ingredients,
        points: parseBulletPoints(product.ingredients),
      },
      {
        key: "howToUse",
        title: t("ProductDetails.howToUse"),
        content: product.howToUse,
        points: parseBulletPoints(product.howToUse),
      },
    ],
    [product.howToUse, product.ingredients, t],
  );

  return {
    t,
    sizeOptions,
    quantity,
    selectedSize: resolvedSelectedSize,
    isWishlisted,
    openAccordion,
    accordions,
    displayPrice,
    shareLinks,
    shareToast,
    handleShareClick,
    handleAddToCart,
    handleToggleWishlist,
    setSelectedSize,
    decrementQty,
    incrementQty,
    toggleAccordion,
  };
}
