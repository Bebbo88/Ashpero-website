import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: "Privacy Policy | Ashperoo",
  description:
    "Read Ashperoo privacy policy, terms and conditions, refund policy, and dispute resolution details.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
