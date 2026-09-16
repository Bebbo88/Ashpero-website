import ReturnsClient from "./ReturnsClient";
import { buildPageMetadata } from "@/utils/pageMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    path: "/returns",
    title: "Shipping & Returns Policy | Ashperoo",
    description:
      "Read Ashperoo shipping policy, terms and conditions, refund policy, and dispute resolution details.",
    locale,
  });
}

export default function ReturnsPage() {
  return <ReturnsClient />;
}
