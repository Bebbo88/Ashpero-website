import AboutUsClient from "./AboutUsClient";
import { buildPageMetadata } from "@/utils/pageMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    path: "/about-us",
    title: "About Us | Ashperoo",
    description: "Learn more about Ashpero, our values, and our mission.",
    locale,
  });
}

export const dynamic = "force-static";
export const revalidate = 86400;

export default function AboutUsPage() {
  return <AboutUsClient />;
}
