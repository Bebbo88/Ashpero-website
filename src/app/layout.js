import { cookies } from "next/headers";
import { Montserrat, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { getDictionary } from "../i18n/dictionaries";
import { LangProvider } from "../hooks/useLanguage";
import { ModeProvider } from "../hooks/useMode";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import FloatingActions from "@/components/layout/FloatingActions";
import NextTopLoader from "nextjs-toploader";
import { CartDrawerProvider } from "@/contexts/CartDrawerContext";
import CartDrawer from "@/components/cart/CartDrawer";
import "./globals.css";
import FacebookPixel from "@/components/MetaPixels/FacebookPixel";

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
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SCRIPT,
          }}
        />
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              fbq('init', '905165305361057');
            `,
          }}
        />
        <NextTopLoader
          color="#4cead2ff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 12px #4cead2ff,0 0 6px #62b7efff"
          zIndex={99999}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=905165305361057&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LangProvider initialLocale={locale} dictionary={dictionary}>
          <ReduxProvider>
            <ReactQueryProvider>
              <AuthSessionProvider>
                <ModeProvider>
                  <CartDrawerProvider>
                    {children}
                    <FacebookPixel />
                    <FloatingActions />
                    <CartDrawer />
                  </CartDrawerProvider>
                </ModeProvider>
              </AuthSessionProvider>
            </ReactQueryProvider>
          </ReduxProvider>
        </LangProvider>

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "y37omyfgff");
          `}
        </Script>
      </body>
    </html>
  );
}
