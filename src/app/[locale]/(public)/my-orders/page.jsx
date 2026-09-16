import MyOrdersClient from "./MyOrdersClient";

// Personal order-history page — never useful in search results.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function MyOrdersPage() {
  return <MyOrdersClient />;
}
