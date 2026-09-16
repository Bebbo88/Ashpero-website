import WishlistClient from "./WishlistClient";

// Personal, per-browser wishlist — never useful in search results.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
