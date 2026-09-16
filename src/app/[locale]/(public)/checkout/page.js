import CheckoutClient from "./CheckoutClient";

// Cart-dependent, personal checkout flow — never useful in search results.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
