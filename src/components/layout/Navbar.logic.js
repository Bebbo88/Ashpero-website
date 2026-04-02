import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [providerMap, setProviderMap] = useState({});

  const navLinks = useMemo(() => NAV_LINKS, []);
  const providers = useMemo(() => Object.values(providerMap), [providerMap]);

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      const loadedProviders = await getProviders();
      if (isMounted && loadedProviders) {
        setProviderMap(loadedProviders);
      }
    };

    loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleLang = () => {
    setLanguage(locale === "en" ? "ar" : "en");
  };

  const loginWithProvider = async (providerId) => {
    setIsAuthMenuOpen(false);
    await signIn(providerId, { callbackUrl: pathname || "/" });
  };

  const logout = async () => {
    setIsAuthMenuOpen(false);
    await signOut({ callbackUrl: pathname || "/" });
  };

  return {
    t,
    locale,
    isDark,
    session,
    isAuthenticated: status === "authenticated",
    isAuthLoading: status === "loading",
    navLinks,
    providers,
    isMobileMenuOpen,
    isAuthMenuOpen,
    isActive,
    toggleDark,
    toggleLang,
    toggleAuthMenu: () => setIsAuthMenuOpen((prev) => !prev),
    closeAuthMenu: () => setIsAuthMenuOpen(false),
    loginWithProvider,
    logout,
    toggleMobileMenu: () => setIsMobileMenuOpen((prev) => !prev),
    closeMobileMenu: () => setIsMobileMenuOpen(false),
  };
}
