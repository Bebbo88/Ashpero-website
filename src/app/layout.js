import { cookies } from 'next/headers';
import { Montserrat, Playfair_Display } from 'next/font/google';
import { getDictionary } from '../i18n/dictionaries';
import { LangProvider } from '../hooks/useLanguage';
import { ModeProvider } from '../hooks/useMode';
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: "Ashpero",
  description: "Ashpero skin care products",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
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
      <body className={`${montserrat.variable} ${playfair.variable} antialiased`}>
        <LangProvider initialLocale={locale} dictionary={dictionary}>
          <ModeProvider>
            {children}
          </ModeProvider>
        </LangProvider>
      </body>
    </html>
  );
}
