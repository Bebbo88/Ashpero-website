import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useMode } from "@/hooks/useMode";

const NAV_LINKS = [
  { href: "/", labelKey: "Navbar.home" },
  { href: "/all-products", labelKey: "Navbar.allProducts" },
  { href: "/about-us", labelKey: "Navbar.aboutUs" },
  { href: "/contact-us", labelKey: "Navbar.contactUs" },
  { href: "/tips-and-tricks", labelKey: "Navbar.tipsAndTricks" },
];

export function useNavbarLogic() {
  const { locale, setLanguage, t } = useLanguage();
  const { isDark, toggleDark } = useMode();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = useMemo(() => NAV_LINKS, []);
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const toggleLang = () => {
    setLanguage(locale === "en" ? "ar" : "en");
  };

  return {
    t,
    locale,
    isDark,
    navLinks,
    isMobileMenuOpen,
    isActive,
    toggleDark,
    toggleLang,
    toggleMobileMenu: () => setIsMobileMenuOpen((prev) => !prev),
    closeMobileMenu: () => setIsMobileMenuOpen(false),
  };
}
