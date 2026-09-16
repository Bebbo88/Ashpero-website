import SuccessClient from "./SuccessClient";

// Personal, order-specific payment-status page — never useful in search results.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessClient />;
}
