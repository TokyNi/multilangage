import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';
import translationMG from './locales/mg/translation.json';

const resources = {
  fr: { translation: translationFR },
  en: { translation: translationEN },
  mg: { translation: translationMG },
};

const savedLanguage = localStorage.getItem('multilang_app_language') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'mg'],
    interpolation: {
      escapeValue: false,
    },
  });

// Synchronize document language attribute and local storage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('multilang_app_language', lng);
  document.documentElement.lang = lng;
});

// Set initial html lang attribute
document.documentElement.lang = savedLanguage;

export default i18n;
