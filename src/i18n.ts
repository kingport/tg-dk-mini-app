import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

const i18nLang = localStorage.getItem('lang') || 'en_US';
i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true,
    },
    fallbackLng: i18nLang,
    keySeparator: false,
    interpolation: { escapeValue: false },
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie'],
    },
  });

export default i18next;
