import NotFoundClient from "./NotFoundClient";
import { LOCALES } from "@/utils/localePath";

export async function generateMetadata({ params }) {
  const { locale: rawLocale } = (await params) || {};
  const locale = LOCALES.includes(rawLocale) ? rawLocale : "en";

  return {
    title:
      locale === "ar"
        ? "الصفحة غير موجودة | Ashperoo"
        : "Page Not Found | Ashperoo",
    description:
      locale === "ar"
        ? "الصفحة اللي بتدور عليها مش موجودة أو تم نقلها."
        : "The page you're looking for doesn't exist or has been moved.",
    robots: { index: false, follow: false },
  };
}

export default function NotFound() {
  return <NotFoundClient />;
}
