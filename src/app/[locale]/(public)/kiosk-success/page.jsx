import KioskSuccessClient from "./KioskSuccessClient";

// Personal, order-specific payment-reference page — never useful in search results.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function KioskSuccessPage() {
  return <KioskSuccessClient />;
}
