'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext({
  locale: 'en',
  dictionary: {},
  setLanguage: () => {},
  t: () => ''
});

export const LangProvider = ({ children, initialLocale, dictionary }) => {
  const [locale, setLocaleState] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLanguage = (newLocale) => {
    if (newLocale !== locale) {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      window.location.reload();
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = dictionary;
    for (const k of keys) {
      if (!value || value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  };

  return (
    <LangContext.Provider value={{ locale, setLanguage, t, dictionary }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLanguage = () => useContext(LangContext);
