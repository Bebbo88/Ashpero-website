import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, setBuyNowItem } from "@/store/slices/cartSlice";
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
  const { t, locale } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items || []);

  const [productShareUrl, setProductShareUrl] = useState("");
  const [shareToast, setShareToast] = useState({
    visible: false,
    message: "",
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [openAccordion, setOpenAccordion] = useState("ingredients");

  const decrementQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const incrementQty = () => setQuantity((prev) => Math.min(10, prev + 1));

  const variants = useMemo(
    () => (Array.isArray(product.variants) ? product.variants : []),
    [product.variants],
  );

  const resolvedVariant = useMemo(() => {
    const normalizedSelectedSize = String(selectedSize || "")
      .trim()
      .toLowerCase();

    return (
      variants.find(
        (variant) =>
          String(variant.size).trim().toLowerCase() === normalizedSelectedSize,
      ) || variants[0]
    );
  }, [selectedSize, variants]);

  const displayPrice = useMemo(() => {
    const variantPrice = Number(resolvedVariant?.price) || 0;

    if (!product.hasOffer) {
      return resolvedVariant?.priceLabel || product.price;
    }

    let discountedPrice = variantPrice;

    if (product.discountType === "percentage") {
      discountedPrice =
        variantPrice -
        (variantPrice * Number(product.discountValue || 0)) / 100;
    }

    if (product.discountType === "fixed") {
      discountedPrice = variantPrice - Number(product.discountValue || 0);
    }

    discountedPrice = Math.max(0, discountedPrice);

    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(discountedPrice);
  }, [
    resolvedVariant,
    product.hasOffer,
    product.discountType,
    product.discountValue,
    product.price,
  ]);
  const resolvedPriceValue = useMemo(() => {
    const variantPrice = Number(resolvedVariant?.price) || 0;

    if (!product.hasOffer) {
      return variantPrice;
    }

    if (product.discountType === "percentage") {
      return Math.max(
        0,
        variantPrice -
        (variantPrice * Number(product.discountValue || 0)) / 100,
      );
    }

    if (product.discountType === "fixed") {
      return Math.max(0, variantPrice - Number(product.discountValue || 0));
    }

    return variantPrice;
  }, [
    resolvedVariant,
    product.hasOffer,
    product.discountType,
    product.discountValue,
  ]);
  const availableStock = Number(resolvedVariant?.stock) || 0;

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const isWishlisted = useMemo(
    () =>
      wishlistItems.some((item) => item.productId === String(product.id || "")),
    [product.id, wishlistItems],
  );

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

  const handleAddToCart = () => {
    if (!resolvedVariant) {
      return;
    }

    if (quantity > availableStock) {
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        image: product.images?.[0] || "/assets/photo1.jpeg",
        category: product.category,
        price: displayPrice,
        priceValue: resolvedPriceValue,
        size: resolvedVariant?.size || "",
        stock: availableStock,
        quantity,
      }),
    );

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: Number(resolvedPriceValue || 0) * (quantity || 1),
        currency: 'EGP'
      });
    }
  };

  const handleBuyNow = () => {
    if (quantity > availableStock) {
      return;
    }

    const itemPriceNum = Number(resolvedPriceValue || 0);
    const totalItemValue = itemPriceNum * (quantity || 1);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "buy_now_checkout_item",
        JSON.stringify({
          id: product.id,
          productId: product.id,
          title: product.title,
          image: product.images?.[0] || "/assets/photo1.jpeg",
          category: product.category,
          price: displayPrice,
          priceValue: resolvedPriceValue,
          size: resolvedVariant?.size || "",
          stock: availableStock,
          quantity,
        })
      );
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: totalItemValue,
        currency: 'EGP'
      });
      window.fbq('track', 'InitiateCheckout', {
        value: totalItemValue,
        currency: 'EGP'
      });
    }

    router.push("/checkout?buyNow=true");
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

    if (!isWishlisted && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToWishlist", {
        value: Number(resolvedPriceValue || 0),
        currency: "EGP",
      });
    }
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
    variants,
    quantity,
    resolvedVariant,
    selectedSize: resolvedVariant?.size || "",
    isWishlisted,
    openAccordion,
    accordions,
    displayPrice,
    oldPrice: resolvedVariant?.priceLabel || "",
    hasOffer: product.hasOffer,
    discountValue: product.discountValue,
    shareLinks,
    shareToast,
    handleShareClick,
    handleAddToCart,
    handleBuyNow,
    handleToggleWishlist,
    setSelectedSize,
    decrementQty,
    incrementQty,
    toggleAccordion,
  };
}
