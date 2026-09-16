import PrivacyPolicyClient from "./PrivacyPolicyClient";
import { buildPageMetadata } from "@/utils/pageMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    path: "/privacy-policy",
    title: "Privacy Policy | Ashperoo",
    description:
      "Read Ashperoo privacy policy, terms and conditions, refund policy, and dispute resolution details.",
    locale,
  });
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
