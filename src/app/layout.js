import { cookies } from "next/headers";
import { Montserrat, Playfair_Display } from "next/font/google";
import { getDictionary } from "../i18n/dictionaries";
import { LangProvider } from "../hooks/useLanguage";
import { ModeProvider } from "../hooks/useMode";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import SplashScreen from "@/components/layout/SplashScreen";
import FloatingActions from "@/components/layout/FloatingActions";
import { CartDrawerProvider } from "@/contexts/CartDrawerContext";
import CartDrawer from "@/components/cart/CartDrawer";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Ashpero",
  description: "Ashpero skin care products",
};

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <LangProvider initialLocale={locale} dictionary={dictionary}>
          <AuthSessionProvider>
            <ModeProvider>
              <CartDrawerProvider>
                <SplashScreen>{children}</SplashScreen>
                <FloatingActions />
                <CartDrawer />
              </CartDrawerProvider>
            </ModeProvider>
          </AuthSessionProvider>
        </LangProvider>
      </body>
    </html>
  );
}
