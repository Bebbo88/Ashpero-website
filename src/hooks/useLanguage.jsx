'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const LangContext = createContext({
  locale: 'en',
  dictionary: {},
  setLanguage: () => {},
  t: () => ''
});

// Client-side dictionary loader (mirrors server-side getDictionary but works in the browser)
const dictionaryLoaders = {
  en: () => import('@/i18n/locales/en.json').then((m) => m.default),
  ar: () => import('@/i18n/locales/ar.json').then((m) => m.default),
};

export const LangProvider = ({ children, initialLocale, dictionary }) => {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);
  const [dict, setDict] = useState(dictionary);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLanguage = useCallback(async (newLocale) => {
    if (newLocale === locale) return;
    if (!dictionaryLoaders[newLocale]) return;

    // 1. Set the cookie so the server layout picks it up on next navigation
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // 2. Load the new dictionary client-side (dynamic import, will be cached)
    try {
      const newDict = await dictionaryLoaders[newLocale]();

      // 3. Update state in-place — no full page reload needed
      setLocaleState(newLocale);
      setDict(newDict);

      // 4. Tell Next.js to re-run server components with the new cookie
      //    This refreshes the RSC payload without a full browser reload.
      router.refresh();
    } catch {
      // Fallback: if dynamic import fails for some reason, do a hard reload
      window.location.reload();
    }
  }, [locale, router]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = dict;
    for (const k of keys) {
      if (!value || value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  }, [dict]);

  return (
    <LangContext.Provider value={{ locale, setLanguage, t, dictionary: dict }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLanguage = () => useContext(LangContext);
