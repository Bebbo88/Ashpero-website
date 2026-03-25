import 'server-only';

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  ar: () => import('./locales/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  if (!dictionaries[locale]) {
    locale = 'en'; // fallback
  }
  return dictionaries[locale]();
};
