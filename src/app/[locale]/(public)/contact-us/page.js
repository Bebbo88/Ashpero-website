import ContactUsClient from "./ContactUsClient";
import { buildPageMetadata } from "@/utils/pageMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    path: "/contact-us",
    title: "Contact Us | Ashperoo",
    description: "Get in touch with the Ashpero team.",
    locale,
  });
}

export const dynamic = "force-static";
export const revalidate = 86400;

export default function ContactUsPage() {
  return <ContactUsClient />;
}
