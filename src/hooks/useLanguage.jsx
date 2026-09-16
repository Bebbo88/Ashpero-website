'use client';

import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { localizePath } from '@/utils/localePath';

const LangContext = createContext({
  locale: 'en',
  dictionary: {},
  setLanguage: () => {},
  t: () => ''
});

// Locale is now determined by the URL (see src/proxy.js and the
// [locale] route segment), so the server always hands this provider the
// correct `initialLocale`/`dictionary` for whatever page is being rendered
// — no client-side cookie or dictionary-swap logic needed anymore.
export const LangProvider = ({ children, initialLocale, dictionary }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = initialLocale;
    document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
  }, [initialLocale]);

  const setLanguage = useCallback((newLocale) => {
    if (newLocale === initialLocale) return;

    const search = typeof window !== 'undefined' ? window.location.search : '';
    router.push(`${localizePath(pathname, newLocale)}${search}`);
  }, [initialLocale, pathname, router]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = dictionary;
    for (const k of keys) {
      if (!value || value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  }, [dictionary]);

  return (
    <LangContext.Provider value={{ locale: initialLocale, setLanguage, t, dictionary }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLanguage = () => useContext(LangContext);
