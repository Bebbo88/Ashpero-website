import { cookies } from "next/headers";
import { Montserrat, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { getDictionary } from "../i18n/dictionaries";
import { LangProvider } from "../hooks/useLanguage";
import { ModeProvider } from "../hooks/useMode";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import SplashScreen from "@/components/layout/SplashScreen";
import FloatingActions from "@/components/layout/FloatingActions";
import { CartDrawerProvider } from "@/contexts/CartDrawerContext";
import CartDrawer from "@/components/cart/CartDrawer";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat-source",
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-source",
  display: "swap",
  preload: false,
});

export const metadata = {
  title: "Ashperoo Skincare",
  description: "Ashperoo skin care products",

  icons: {
    icon: [
      {
        url: "/assets/favicon-dark.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/assets/favicon-light.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],

    // fallback
    shortcut: "/assets/favicon-light.png",
  },
};

const THEME_INIT_SCRIPT = `
  try {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (_) {}
`;

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const dictionary = await getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <LangProvider initialLocale={locale} dictionary={dictionary}>
          <ReduxProvider>
            <ReactQueryProvider>
              <AuthSessionProvider>
                <ModeProvider>
                  <CartDrawerProvider>
                    <SplashScreen>{children}</SplashScreen>
                    <FloatingActions />
                    <CartDrawer />
                  </CartDrawerProvider>
                </ModeProvider>
              </AuthSessionProvider>
            </ReactQueryProvider>
          </ReduxProvider>
        </LangProvider>
      </body>
    </html>
  );
}
