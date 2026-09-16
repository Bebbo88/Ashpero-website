import FailedClient from "./FailedClient";

// Personal, order-specific payment-status page — never useful in search results.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function FailedPage() {
  return <FailedClient />;
}
