"use client";

import dynamic from "next/dynamic";

// CartDrawer is mounted in the root layout (every page), but most visitors
// never open the cart. Deferring it to its own chunk (same pattern already
// used for AIChatBox) keeps its framer-motion + icon imports out of every
// page's initial bundle. `ssr: false` requires a Client Component boundary,
// which is why this thin wrapper exists — the root layout is a Server
// Component and can't call next/dynamic with ssr:false directly.
const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });

export default CartDrawer;
